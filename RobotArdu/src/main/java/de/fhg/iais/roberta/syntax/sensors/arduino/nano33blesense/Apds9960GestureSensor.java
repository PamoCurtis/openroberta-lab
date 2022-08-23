package de.fhg.iais.roberta.syntax.sensors.arduino.nano33blesense;

import java.util.List;

import de.fhg.iais.roberta.blockly.generated.Block;
import de.fhg.iais.roberta.blockly.generated.Value;
import de.fhg.iais.roberta.syntax.Phrase;
import de.fhg.iais.roberta.syntax.lang.expr.Expr;
import de.fhg.iais.roberta.syntax.sensor.InternalSensor;
import de.fhg.iais.roberta.transformer.Ast2Jaxb;
import de.fhg.iais.roberta.transformer.Jaxb2Ast;
import de.fhg.iais.roberta.transformer.Jaxb2ProgramAst;
import de.fhg.iais.roberta.transformer.forClass.NepoBasic;
import de.fhg.iais.roberta.util.ast.BlocklyProperties;
import de.fhg.iais.roberta.util.syntax.BlocklyConstants;

@NepoBasic(name = "APDS9960_GESTURE", category = "SENSOR", blocklyNames = {"robsensors_apds9960_gesture_getDataAvailableSample"})
public final class Apds9960GestureSensor extends InternalSensor {

    public final Expr gesture;

    public Apds9960GestureSensor(BlocklyProperties properties, Expr gesture) {
        super(properties, null);
        this.gesture = gesture;
        setReadOnly();
    }

    public static Phrase jaxbToAst(Block block, Jaxb2ProgramAst helper) {
        List<Value> values = Jaxb2Ast.extractValues(block, (short) 1);
        Expr gesture = helper.getVar(values, BlocklyConstants.VARIABLE_VALUE);
        return new Apds9960GestureSensor(Jaxb2Ast.extractBlocklyProperties(block), gesture);
    }

    @Override
    public Block astToBlock() {
        Block block = new Block();
        Ast2Jaxb.setBasicProperties(this, block);
        Ast2Jaxb.addValue(block, BlocklyConstants.VARIABLE_VALUE, this.gesture);
        return block;
    }
}