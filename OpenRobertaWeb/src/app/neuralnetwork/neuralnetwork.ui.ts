/**
 * This is an addition to the Open Roberta Lab. It supports self programmed Neural Networks.
 * Our work is heavily based on the tensorflow playground, see https://github.com/tensorflow/playground.
 * The Open Roberta Lab is open source and uses the Apache 2.0 License, see https://www.apache.org/licenses/LICENSE-2.0
 */

import * as H from './neuralnetwork.helper';
import { Link, Network, Node } from './neuralnetwork.nn';
import { State } from './neuralnetwork.uistate';
import * as LOG from 'log';
import * as MSG from './neuralnetwork.msg';

import * as _D3 from 'd3';

enum NodeType {
    INPUT,
    HIDDEN,
    OUTPUT,
}

enum FocusStyle {
    CLICK_WEIGHT_BIAS,
    CLICK_NODE,
    SHOW_ALL,
}

let D3: typeof _D3; // used for lazy loading
type D3Selection = _D3.Selection<any>;

let focusStyle = FocusStyle.CLICK_WEIGHT_BIAS;
let focusNode = null;

let state: State = null;
let network: Network = null;

export function setupNN(stateFromNNstep: any, inputNeurons: string[], outputNeurons: string[]) {
    state = new State(stateFromNNstep, inputNeurons, outputNeurons);
    makeNetworkFromState();
}

export async function runNNEditor() {
    D3 = await import('d3');
    D3.select('#goto-sim').on('click', () => {
        $.when($('#tabProgram').trigger('click')).done(function () {
            $('#simButton').trigger('click');
        });
    });

    D3.select('#add-layers').on('click', () => {
        if (state.numHiddenLayers >= 6) {
            return;
        }
        state.networkShape[state.numHiddenLayers] = 2;
        state.numHiddenLayers++;
        reconstructNNIncludingUI();
    });

    D3.select('#remove-layers').on('click', () => {
        if (state.numHiddenLayers <= 0) {
            return;
        }
        state.numHiddenLayers--;
        state.networkShape.splice(state.numHiddenLayers);
        reconstructNNIncludingUI();
    });

    let activationDropdown = D3.select('#activations').on('change', function () {
        state.activationKey = this.value;
        state.activation = H.activations[this.value];
        reconstructNNIncludingUI();
    });
    activationDropdown.property('value', getKeyFromValue(H.activations, state.activation));

    let focusDropdown = D3.select('#nn-focus').on('change', function () {
        focusStyle = FocusStyle[(this as HTMLSelectElement).value];
        if (focusStyle === undefined || focusStyle === null) {
            focusStyle = FocusStyle.CLICK_WEIGHT_BIAS;
        }
        drawNetworkUI(network);
    });

    // Listen for css-responsive changes and redraw the svg network.
    window.addEventListener('resize', () => {
        drawNetworkUI(network);
    });
    reconstructNNIncludingUI();
    return;

    function getKeyFromValue(obj: any, value: any): string {
        for (let key in obj) {
            if (obj[key] === value) {
                return key;
            }
        }
        return undefined;
    }
}

function reconstructNNIncludingUI() {
    makeNetworkFromState();
    drawNetworkUI(network);
}

function drawNetworkUI(network: Network): void {
    D3.select('#activation-label').attr('class', 'nn-bold').text(MSG.get('ACTIVATION'));
    D3.select('#regularization-label').attr('class', 'nn-bold').text(MSG.get('REGULARIZATION'));
    D3.select('#nn-focus-label').attr('class', 'nn-bold').text(MSG.get('FOCUS_OPTION'));
    $('#nn-focus [value="CLICK_WEIGHT_BIAS"]').text(MSG.get('CLICK_WEIGHT_BIAS'));
    $('#nn-focus [value="CLICK_NODE"]').text(MSG.get('CLICK_NODE'));
    $('#nn-focus [value="SHOW_ALL"]').text(MSG.get('SHOW_ALL'));

    let layerKey = state.numHiddenLayers === 1 ? 'HIDDEN_LAYER' : 'HIDDEN_LAYERS';
    D3.select('#layers-label').text(MSG.get(layerKey));
    D3.select('#num-layers').text(state.numHiddenLayers);

    const networkImpl = network.getLayerAndNodeArray();
    const svg: D3Selection = D3.select('#nn-svg');

    svg.select('g.core').remove();
    D3.select('#nn-main-part').selectAll('div.canvas').remove();
    D3.select('#nn-main-part').selectAll('div.plus-minus-neurons').remove();

    const nnD3 = D3.select('#nn')[0][0] as HTMLDivElement;
    const topControlD3 = D3.select('#nn-top-controls')[0][0] as HTMLDivElement;
    const mainPartHeight = nnD3.clientHeight - topControlD3.clientHeight - 50;

    // set the width of the svg container.
    const mainPart = D3.select('#nn-main-part')[0][0] as HTMLDivElement;
    mainPart.setAttribute('style', 'height:' + mainPartHeight + 'px');
    const widthOfWholeNNDiv = mainPart.clientWidth;
    const heightOfWholeNNDiv = mainPartHeight;
    svg.attr('width', widthOfWholeNNDiv);
    svg.attr('height', heightOfWholeNNDiv);

    const numLayers = networkImpl.length;

    // vertical distance (Y) between nodes and node size
    let maxNumberOfNodesOfAllLayers = networkImpl.map((layer) => layer.length).reduce((a, b) => Math.max(a, b), 0);
    maxNumberOfNodesOfAllLayers = maxNumberOfNodesOfAllLayers < 1 ? 1 : maxNumberOfNodesOfAllLayers;
    const totalYBetweenTwoNodes = heightOfWholeNNDiv / maxNumberOfNodesOfAllLayers;
    const nodeSize = (totalYBetweenTwoNodes < 100 ? totalYBetweenTwoNodes : 100) / 2;
    const usedYBetweenTwoNodes = (heightOfWholeNNDiv - 2 * nodeSize) / maxNumberOfNodesOfAllLayers;
    const biasSize = 10;

    // horizontal distance (X) between layers
    const maxXBetweenTwoLayers = (widthOfWholeNNDiv - numLayers * nodeSize) / (numLayers - 1);
    const usedXBetweenTwoLayers = maxXBetweenTwoLayers > 500 ? 500 : maxXBetweenTwoLayers;
    const startXFirstLayer = (widthOfWholeNNDiv - usedXBetweenTwoLayers * (numLayers - 1)) / 2;
    function nodeStartY(nodeIndex: number): number {
        return nodeIndex * usedYBetweenTwoNodes + nodeSize / 2;
    }
    function layerStartX(layerIdx: number): number {
        return startXFirstLayer + layerIdx * usedXBetweenTwoLayers - nodeSize / 2;
    }

    // Map of all node and link coordinates.
    let node2coord: { [id: string]: { cx: number; cy: number } } = {};
    let container: D3Selection = svg.append('g').classed('core', true).attr('transform', `translate(3,3)`);

    // Draw the input layer separately.
    let numNodes = networkImpl[0].length;
    let cxI = layerStartX(0);
    let nodeIds = state.inputs;
    for (let i = 0; i < numNodes; i++) {
        let node = networkImpl[0][i];
        let cy = nodeStartY(i);
        node2coord[node.id] = { cx: cxI, cy: cy };
        drawNode(node, NodeType.INPUT, cxI, cy, container);
    }
    // Draw the intermediate layers, exclude input (id:0) and output (id:numLayers-1)
    for (let layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) {
        let numNodes = networkImpl[layerIdx].length;
        let cxH = layerStartX(layerIdx);
        addPlusMinusControl(cxH - nodeSize / 2 - biasSize, layerIdx);
        for (let i = 0; i < numNodes; i++) {
            let node = networkImpl[layerIdx][i];
            let cy = nodeStartY(i);
            node2coord[node.id] = { cx: cxH, cy: cy };
            drawNode(node, NodeType.HIDDEN, cxH, cy, container);
            // Draw links.
            for (let j = 0; j < node.inputLinks.length; j++) {
                let link = node.inputLinks[j];
                let path: SVGPathElement = drawLink(link, node2coord, networkImpl, container, j === 0, j, node.inputLinks.length).node() as any;
            }
        }
    }

    // Draw the output nodes separately.
    {
        let outputLayer = networkImpl[numLayers - 1];
        let numOutputs = outputLayer.length;
        let cxO = layerStartX(numLayers - 1);
        for (let j = 0; j < numOutputs; j++) {
            let node = outputLayer[j];
            let cy = nodeStartY(j);
            node2coord[node.id] = { cx: cxO, cy: cy };
            drawNode(node, NodeType.OUTPUT, cxO, cy, container);
            // Draw links.
            for (let i = 0; i < node.inputLinks.length; i++) {
                let link = node.inputLinks[i];
                drawLink(link, node2coord, networkImpl, container, i === 0, i, node.inputLinks.length);
            }
        }
    }

    // Adjust the height of the features column.
    let height = getRelativeHeight(D3.select('#nn-network'));
    D3.select('.nn-features').style('height', height + 'px');

    updateUI();
    return;

    function drawNode(node: Node, nodeType: NodeType, cx: number, cy: number, container: D3Selection) {
        let nodeId = node.id;
        let x = cx - nodeSize / 2;
        let y = cy - nodeSize / 2;
        let nodeClass = nodeType === NodeType.INPUT ? 'node_input' : nodeType === NodeType.HIDDEN ? 'node_hidden' : 'node_output';
        let nodeGroup: D3Selection = container.append('g').attr({
            class: nodeClass,
            id: `${nodeId}`,
            transform: `translate(${x},${y})`,
        });

        let mainRectAngle = nodeGroup.append('rect').attr({
            x: 0,
            y: 0,
            width: nodeSize,
            height: nodeSize,
        });
        if (focusStyle === FocusStyle.CLICK_NODE && focusNode === node) {
            mainRectAngle.style('fill', 'yellow');
        }
        if (focusStyle === FocusStyle.CLICK_NODE) {
            nodeGroup.on('click', function () {
                focusNode = node;
                drawNetworkUI(network);
            });
        }

        let labelForId = nodeGroup.append('text').attr({
            class: 'main-label',
            x: 10,
            y: 0.66 * nodeSize,
            'text-anchor': 'start',
            cursor: 'default',
        });
        labelForId.append('tspan').text(nodeId);
        if (nodeType !== NodeType.INPUT) {
            let biasRect = nodeGroup.append('rect').attr({
                id: `bias-${nodeId}`,
                x: -biasSize - 2,
                y: nodeSize - biasSize + 3,
                width: biasSize,
                height: biasSize,
            });
            if (focusStyle !== FocusStyle.CLICK_NODE || focusNode === node) {
                biasRect
                    .on('click', function () {
                        updateEditCard(node, D3.mouse(container.node()));
                    })
                    .on('mouseleave', function () {
                        updateEditCard(null);
                    });
            }
            // Show the bias value depending on focus-style
            if (focusStyle === FocusStyle.SHOW_ALL || (focusStyle === FocusStyle.CLICK_NODE && focusNode === node)) {
                drawValue(nodeGroup, nodeId, -2 * biasSize, nodeSize + 2 * biasSize, node.bias, node.biasOrig);
            }
        }

        // Draw the node's canvas.
        let div = D3.select('#nn-network')
            .insert('div', ':first-child')
            .attr({
                id: `canvas-${nodeId}`,
                class: 'canvas',
            })
            .style({
                position: 'absolute',
                left: `${x + 3}px`,
                top: `${y + 3}px`,
            });
    }

    let valShiftToRight = true;

    function drawLink(
        link: Link,
        node2coord: { [id: string]: { cx: number; cy: number } },
        network: Node[][],
        container: D3Selection,
        isFirst: boolean,
        index: number,
        length: number
    ) {
        let line = container.insert('path', ':first-child');
        let source = node2coord[link.source.id];
        let dest = node2coord[link.dest.id];
        let datum = {
            source: {
                y: source.cx + nodeSize / 2 + 2,
                x: source.cy,
            },
            target: {
                y: dest.cx - nodeSize / 2,
                x: dest.cy + ((index - (length - 1) / 2) / length) * 12,
            },
        };
        let diagonal = D3.svg.diagonal().projection((d) => [d.y, d.x]);
        line.attr({
            'marker-start': 'url(#markerArrow)',
            class: 'link',
            id: link.source.id + '-' + link.dest.id,
            d: diagonal(datum, 0),
        });

        // Show the value of the link depending on focus-style
        if (focusStyle === FocusStyle.SHOW_ALL || (focusStyle === FocusStyle.CLICK_NODE && link.source === focusNode) || link.dest === focusNode) {
            let lineNode = line.node() as any;
            valShiftToRight = !valShiftToRight;
            let posVal = focusStyle === FocusStyle.SHOW_ALL ? (valShiftToRight ? 0.6 : 0.4) : link.source === focusNode ? 0.8 : 0.2;
            let pointForWeight = lineNode.getPointAtLength(lineNode.getTotalLength() * posVal);
            drawValue(container, link.source.id + '-' + link.dest.id, pointForWeight.x, pointForWeight.y - 10, link.weight, link.weightOrig);
        }

        // Add an (almost) invisible thick path that will be used for editing the weight value on click.
        if (focusStyle !== FocusStyle.CLICK_NODE || link.source === focusNode || link.dest === focusNode) {
            let cssForPath = focusStyle !== FocusStyle.CLICK_NODE ? 'nn-weight-click' : 'nn-weight-show-click';
            container
                .append('path')
                .attr('d', diagonal(datum, 0))
                .attr('class', cssForPath)
                .on('click', function () {
                    updateEditCard(link, D3.mouse(this));
                })
                .on('mouseleave', function () {
                    updateEditCard(null);
                });
        }
        return line;
    }

    function getRelativeHeight(selection) {
        let node = selection.node() as HTMLAnchorElement;
        return node.offsetHeight + node.offsetTop;
    }

    function addPlusMinusControl(x: number, layerIdx: number) {
        let div = D3.select('#nn-network').append('div').classed('plus-minus-neurons', true).style('left', `${x}px`);
        let i = layerIdx - 1;
        let firstRow = div.append('div');
        firstRow
            .append('button')
            .attr('class', 'plus-minus-neuron-button')
            .on('click', () => {
                let numNeurons = state.networkShape[i];
                if (numNeurons >= 6) {
                    return;
                }
                state.networkShape[i]++;
                reconstructNNIncludingUI();
            })
            .append('i')
            .attr('class', 'material-icons nn-middle-size')
            .text('add');

        firstRow
            .append('button')
            .attr('class', 'plus-minus-neuron-button')
            .on('click', () => {
                let numNeurons = state.networkShape[i];
                if (numNeurons <= 1) {
                    return;
                }
                state.networkShape[i]--;
                reconstructNNIncludingUI();
            })
            .append('i')
            .attr('class', 'material-icons nn-middle-size')
            .text('remove');

        let suffix = state.networkShape[i] > 1 ? 's' : '';
        div.append('div')
            .attr('class', 'nn-bold')
            .text(state.networkShape[i] + ' neuron' + suffix);
    }

    function drawValue(container: D3Selection, id: string, x: number, y: number, valueForColor: number, valueToShow: string) {
        const rect = container.append('rect').attr('id', 'rect-val-' + id);
        const text = container
            .append('text')
            .attr({
                class: 'nn-showval',
                id: 'val-' + id,
                x: x,
                y: y,
            })
            .text(valueToShow);
        drawValuesBox(text, valueForColor);
    }
}

function updateEditCard(nodeOrLink?: Node | Link, coordinates?: [number, number]) {
    // nodeOrLink : nn.Node | nn.Link
    let editCard = D3.select('#nn-editCard');

    if (nodeOrLink == null) {
        editCard.style('display', 'none');
        return;
    }

    let input = editCard.select('input');
    input.property('value', getNodeLinkValue(nodeOrLink));
    input.on('input', () => {
        let event = D3.event as any;
        fromEditCard2NodeLink(nodeOrLink, event.target.value);
    });
    input.on('keypress', () => {
        let event = D3.event as any;
        if (event.key === 'h' || event.key === 'i') {
            event.target.value = updValue(event.target.value, 1);
            event.preventDefault && event.preventDefault();
            fromEditCard2NodeLink(nodeOrLink, event.target.value);
        } else if (event.key === 'r' || event.key === 'd') {
            event.target.value = updValue(event.target.value, -1);
            event.preventDefault && event.preventDefault();
            fromEditCard2NodeLink(nodeOrLink, event.target.value);
        } else if (event.which === 13) {
            editCard.style('display', 'none');
            event.preventDefault && event.preventDefault();
            return;
        }
        (input.node() as HTMLInputElement).focus();
    });
    let value = nodeOrLink instanceof Link ? nodeOrLink.weightOrig : nodeOrLink.biasOrig;

    editCard.style({
        left: `${coordinates[0] + 20}px`,
        top: `${coordinates[1]}px`,
        display: 'block',
    });
    let name = nodeOrLink instanceof Link ? 'WEIGHT' : 'BIAS';
    editCard.select('.nn-type').text(MSG.get(name));
    (input.node() as HTMLInputElement).focus();

    function fromEditCard2NodeLink(nodeOrLink: Node | Link, value: string) {
        if (value != null) {
            if (nodeOrLink instanceof Link) {
                let weights = H.string2weight(value);
                nodeOrLink.weight = weights[0];
                nodeOrLink.weightOrig = weights[1];
            } else if (nodeOrLink instanceof Node) {
                let biases = H.string2bias(value);
                nodeOrLink.bias = biases[0];
                nodeOrLink.biasOrig = biases[1];
            } else {
                throw 'invalid nodeOrLink';
            }
            state.weights = network.getWeightArray();
            state.biases = network.getBiasArray();
            updateUI();
        }
    }

    function updValue(value: string, incr: number): string {
        let valueTrimmed = value.trim();
        if (valueTrimmed === '') {
            return String(incr);
        } else {
            let opOpt = valueTrimmed.substr(0, 1);
            let number;
            if (opOpt === '*' || opOpt === ':' || opOpt === '/') {
                number = +valueTrimmed.substr(1).trim();
            } else {
                opOpt = '';
                number = +valueTrimmed;
            }
            if (isNaN(number)) {
                return String(incr);
            } else {
                return opOpt + (number + incr);
            }
        }
    }
}

function updateUI() {
    const container = D3.select('g.core');
    updateLinksUI(container);
    updateNodesUI(container);

    function updateLinksUI(container) {
        let linkWidthScale = mkWidthScale();
        let colorScale = mkColorScale();
        network.forEachLink((link) => {
            const baseName = link.source.id + '-' + link.dest.id;
            container.select(`#${baseName}`).style({
                'stroke-dashoffset': 0,
                'stroke-width': linkWidthScale(Math.abs(link.weight)),
                stroke: colorScale(link.weight),
            });
            const val = container.select(`#val-${baseName}`);
            if (!val.empty()) {
                val.text(link.weightOrig);
                drawValuesBox(val, link.weight);
            }
        });
    }

    function updateNodesUI(container) {
        let colorScale = mkColorScale();
        network.forEachNode(true, (node) => {
            D3.select(`#bias-${node.id}`).style('fill', colorScale(node.bias));
            let val = D3.select(`#val-${node.id}`);
            if (!val.empty()) {
                val.text(node.biasOrig);
                drawValuesBox(val, node.bias);
            }
        });
    }
}

function mkWidthScale(): _D3.scale.Linear<number, number> {
    let maxWeight = 0;
    function updMaxWeight(link: Link): void {
        let absLinkWeight = Math.abs(link.weight);
        if (absLinkWeight > maxWeight) {
            maxWeight = absLinkWeight;
        }
    }
    network.forEachLink(updMaxWeight);
    const MAX_WIDTH = 6;
    return D3.scale.linear().domain([0, maxWeight]).range([1, MAX_WIDTH]).clamp(true);
}

function mkColorScale(): _D3.scale.Linear<string, number> {
    let maxWeight = 0;
    function updMaxWeight(link: Link): void {
        let absLinkWeight = Math.abs(link.weight);
        if (absLinkWeight > maxWeight) {
            maxWeight = absLinkWeight;
        }
    }
    network.forEachLink(updMaxWeight);
    return D3.scale.linear<string, number>().domain([-1, 0, 1]).range(['#f59322', '#e8eaeb', '#0877bd']).clamp(true);
}

function drawValuesBox(text: D3Selection, valueForColor: number): void {
    const rect = D3.select('#rect-' + text.attr('id'));
    const bbox = (text.node() as any).getBBox();
    rect.attr('x', bbox.x - 4);
    rect.attr('y', bbox.y);
    rect.attr('width', bbox.width + 8);
    rect.attr('height', bbox.height);
    rect.style('fill', val2color(valueForColor));

    function val2color(val: number): string {
        return val < 0 ? '#f5932260' : val == 0 ? '#e8eaeb60' : '#0877bd60';
    }
}

function makeNetworkFromState() {
    network = new Network(state);
}

function getNodeLinkValue(nodeOrLink: Node | Link) {
    if (nodeOrLink instanceof Link) {
        return nodeOrLink.weight;
    } else if (nodeOrLink instanceof Node) {
        return nodeOrLink.bias;
    } else {
        throw 'invalid nodeOrLink';
    }
}

/**
 * extract weights and biases from the network (only this can be changed either by the program or the user),
 * put them into the state and return the state to be stored in the blockly XML in the NNStep block
 * @return the stringified state
 */
export function getStateAsJSONString(): string {
    try {
        state.weights = network.getWeightArray();
        state.biases = network.getBiasArray();
        return JSON.stringify(state);
    } catch (e) {
        LOG.error('failed to create a JSON string from nn state');
        return '';
    }
}

export function getNetwork(): Network {
    return network;
}
