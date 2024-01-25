var __spreadArray=this&&this.__spreadArray||function(t,e,s){if(s||2===arguments.length)for(var r,i=0,o=e.length;i<o;i++)!r&&i in e||(r||(r=Array.prototype.slice.call(e,0,i)),r[i]=e[i]);return t.concat(r||Array.prototype.slice.call(e))};define(["require","exports","util.roberta","jquery","simulation.objects","robot.base","robot.base.mobile"],(function(t,e,s,r,i,o,a){Object.defineProperty(e,"__esModule",{value:!0}),e.SimulationScene=void 0;var n=function(){function t(t){this.DEFAULT_TRAIL_WIDTH=10,this.DEFAULT_TRAIL_COLOR="#000000",this.customBackgroundLoaded=!1,this.ground=new i.Ground(0,0,0,0),this.imgBackgroundList=[],this.imgPath="/css/img/simBackgrounds/",this.playground={x:0,y:0,w:0,h:0},this._colorAreaList=[],this._obstacleList=[],this._markerList=[],this._redrawColorAreas=!1,this._redrawObstacles=!1,this._redrawMarkers=!1,this._robots=[],this._uniqueObjectId=0,this.sim=t,this.uCanvas=document.createElement("canvas"),this.uCtx=this.uCanvas.getContext("2d",{willReadFrequently:!0}),this.udCanvas=document.createElement("canvas"),this.udCtx=this.udCanvas.getContext("2d",{willReadFrequently:!0}),this.bCtx=r("#backgroundLayer")[0].getContext("2d"),this.dCtx=r("#drawLayer")[0].getContext("2d"),this.aCtx=r("#arucoMarkerLayer")[0].getContext("2d"),this.oCtx=r("#objectLayer")[0].getContext("2d"),this.rCtx=r("#robotLayer")[0].getContext("2d")}return Object.defineProperty(t.prototype,"uniqueObjectId",{get:function(){return++this._uniqueObjectId},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"robots",{get:function(){return this._robots},set:function(t){this.clearList(this._robots),this._robots=t},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"obstacleList",{get:function(){return this._obstacleList},set:function(t){this.clearList(this._obstacleList),this._obstacleList=t,this.redrawObstacles=!0},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"colorAreaList",{get:function(){return this._colorAreaList},set:function(t){this.clearList(this._colorAreaList),this._colorAreaList=t,this.redrawColorAreas=!0},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"markerList",{get:function(){return this._markerList},set:function(t){this.clearList(this._markerList),this._markerList=t,this.redrawMarkers=!0},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"redrawObstacles",{get:function(){return this._redrawObstacles},set:function(t){this._redrawObstacles=t},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"redrawColorAreas",{get:function(){return this._redrawColorAreas},set:function(t){this._redrawColorAreas=t},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"redrawMarkers",{get:function(){return this._redrawMarkers},set:function(t){this._redrawMarkers=t},enumerable:!1,configurable:!0}),t.prototype.addColorArea=function(t){this.addSimulationObject(this.colorAreaList,t,i.SimObjectType.ColorArea),this.redrawColorAreas=!0},t.prototype.addImportColorAreaList=function(t){var e=this,s=[];t.forEach((function(t){var r=i.SimObjectFactory.getSimObject.apply(i.SimObjectFactory,__spreadArray([t.id,e,e.sim.selectionListener,t.shape,i.SimObjectType.ColorArea,t.p,null,t.color],t.params,!1));s.push(r)})),this.colorAreaList=s},t.prototype.addImportObstacle=function(t){var e=this,s=[];t.forEach((function(t){var r=i.SimObjectFactory.getSimObject.apply(i.SimObjectFactory,__spreadArray([t.id,e,e.sim.selectionListener,t.shape,i.SimObjectType.Obstacle,t.p,null,t.color],t.params,!1));s.push(r)})),this.obstacleList=s},t.prototype.addImportMarkerList=function(t){var e=this,s=[];t.forEach((function(t){var r=i.SimObjectFactory.getSimObject.apply(i.SimObjectFactory,__spreadArray([t.id,e,e.sim.selectionListener,t.shape,i.SimObjectType.Marker,t.p,null,t.color],t.params,!1));r.markerId=t.markerId,s.push(r)})),this.markerList=s},t.prototype.addObstacle=function(t){this.addSimulationObject(this.obstacleList,t,i.SimObjectType.Obstacle),this.redrawObstacles=!0},t.prototype.addSimulationObject=function(t,e,s,o){var a=r("#robotLayer");a.attr("tabindex",0),a.trigger("focus");var n=Math.random()*(this.ground.w-300)+100,h=Math.random()*(this.ground.h-200)+100,c=i.SimObjectFactory.getSimObject(this.uniqueObjectId,this,this.sim.selectionListener,e,s,{x:n,y:h},this.backgroundImg.width);e==i.SimObjectShape.Marker&&o&&(c.markerId=o),t.push(c),c.selected=!0},t.prototype.changeColorWithColorPicker=function(t){var e=this.obstacleList.concat(this.colorAreaList).filter((function(t){return t.selected}));1==e.length&&(e[0].color=t,e[0].type===i.SimObjectType.Obstacle?this.redrawObstacles=!0:this.redrawColorAreas=!0)},t.prototype.clearList=function(t){t.forEach((function(t){t.destroy()})),t.length=0},t.prototype.deleteSelectedObject=function(){var t=this;function e(e){for(var s=0;s<e.length;s++)if(e[s].selected)return e[s].destroy(),e.splice(s,1),t.redrawObstacles=!0,!0;return!1}e(this.obstacleList)?this.redrawObstacles=!0:e(this.colorAreaList)?this.redrawColorAreas=!0:e(this.markerList)&&(this.redrawMarkers=!0)},t.prototype.draw=function(t,e){var s=this;this.rCtx.save(),this.rCtx.scale(this.sim.scale,this.sim.scale),this.rCtx.clearRect(this.ground.x-10,this.ground.y-10,this.ground.w+20,this.ground.h+20),this.dCtx.save(),this.dCtx.scale(this.sim.scale,this.sim.scale),this.robots.forEach((function(r){r.draw(s.rCtx,t),r instanceof a.RobotBaseMobile&&e&&(s.backgroundImg.src.indexOf("math")<0?r.drawTrail(s.dCtx,s.udCtx,s.DEFAULT_TRAIL_WIDTH,s.DEFAULT_TRAIL_COLOR):r.drawTrail(s.dCtx,s.udCtx,1,"#ffffff"))})),this.redrawColorAreas&&(this.drawColorAreas(),this.redrawColorAreas=!1),this.redrawObstacles&&(this.drawObstacles(),this.redrawObstacles=!1),this.redrawMarkers&&(this.drawMarkers(),this.redrawMarkers=!1),this.rCtx.restore(),this.dCtx.restore()},t.prototype.drawColorAreas=function(){var t=this,e=this.backgroundImg.width+20,s=this.backgroundImg.height+20;this.uCtx.clearRect(0,0,e,s),this.uCtx.drawImage(this.backgroundImg,10,10,this.backgroundImg.width,this.backgroundImg.height),this.drawPattern(this.uCtx,!1),this.bCtx.restore(),this.bCtx.save(),this.bCtx.drawImage(this.backgroundImg,10*this.sim.scale,10*this.sim.scale,this.backgroundImg.width*this.sim.scale,this.backgroundImg.height*this.sim.scale),this.drawPattern(this.bCtx,!0),this.bCtx.scale(this.sim.scale,this.sim.scale),this.colorAreaList.forEach((function(e){return e.draw(t.bCtx,t.uCtx)}))},t.prototype.drawObstacles=function(){var t=this;this.oCtx.restore(),this.oCtx.save(),this.oCtx.scale(this.sim.scale,this.sim.scale),this.oCtx.clearRect(this.ground.x-10,this.ground.y-10,this.ground.w+20,this.ground.h+20),this.obstacleList.forEach((function(e){return e.draw(t.oCtx,t.uCtx)}))},t.prototype.drawMarkers=function(){var t=this;this.aCtx.restore(),this.aCtx.save(),this.aCtx.scale(this.sim.scale,this.sim.scale),this.aCtx.clearRect(this.ground.x-10,this.ground.y-10,this.ground.w+20,this.ground.h+20),this.markerList.forEach((function(e){return e.draw(t.aCtx,t.uCtx)}))},t.prototype.drawPattern=function(t,e){if(this.images&&this.images.pattern){var s=10,r=1;e&&(s*=this.sim.scale,r=this.sim.scale),t.beginPath();var i=this.images.pattern;t.strokeStyle=t.createPattern(i,"repeat"),t.lineWidth=s,t.strokeRect(s/2,s/2,this.backgroundImg.width*r+s,this.backgroundImg.height*r+s)}},t.prototype.getRobotPoses=function(){return this.robots.map((function(t){return[t.pose,t.initialPose]}))},t.prototype.handleKeyEvent=function(t){"v"===t.key&&(t.ctrlKey||t.metaKey)&&(this.pasteObject(this.sim.lastMousePosition),t.stopImmediatePropagation()),"Delete"!==t.key&&"Backspace"!==t.key||(this.deleteSelectedObject(),t.stopImmediatePropagation())},t.prototype.init=function(t,e,a,n,h,c){var d=this,u=!this.robotType||this.robotType!=t;this.robotType=t;var g=this;e?(r("#canvasDiv").hide(),r("#simDiv>.pace").show(),this.robots=[],o.RobotFactory.createRobots(a,n,h,this.sim.selectionListener,this.robotType).then((function(t){if(d.robots=t.robots,d.robotClass=t.robotClass,d.initViews(),u){g.imgBackgroundList=[],g.currentBackground=0,g.obstacleList.length>0&&(g.obstacleList=[]),g.colorAreaList.length>0&&(g.colorAreaList=[]);var e=".svg";s.isIE()&&(e=".png"),g.loadBackgroundImages((function(){g.robots[0].mobile?(r(".simMobile").show(),g.images=g.loadImages(["roadWorks","pattern"],["roadWorks"+e,"wallPattern.png"],(function(){g.ground=new i.Ground(10,10,g.imgBackgroundList[g.currentBackground].width,g.imgBackgroundList[g.currentBackground].height),g.backgroundImg=g.imgBackgroundList[0];var t=new i.RectangleSimulationObject(0,g,g.sim.selectionListener,i.SimObjectType.Obstacle,{x:7*g.backgroundImg.width/9,y:g.backgroundImg.height-2*g.backgroundImg.width/9},g.backgroundImg.width);g.obstacleList.push(t),g.centerBackground(!0),g.initEvents(),g.sim.initColorPicker(o.RobotBase.colorRange),g.showFullyLoadedSim(c),g.sim.start()}))):(r(".simMobile").hide(),g.images={},g.ground=new i.Ground(10,10,g.imgBackgroundList[g.currentBackground].width,g.imgBackgroundList[g.currentBackground].height),g.backgroundImg=g.imgBackgroundList[0],g.centerBackground(!0),g.initEvents(),g.showFullyLoadedSim(c),g.sim.start())}))}d.showFullyLoadedSim(c),d.sim.start()}))):(this.robots.forEach((function(t,e){t.replaceState(a[e]),t.reset()})),this.showFullyLoadedSim(c))},t.prototype.showFullyLoadedSim=function(t){this.obstacleList.forEach((function(t){t.removeMouseEvents(),t.addMouseEvents()})),this.markerList.forEach((function(t){t.removeMouseEvents(),t.addMouseEvents()})),this.colorAreaList.forEach((function(t){t.removeMouseEvents(),t.addMouseEvents()})),r("#canvasDiv").fadeIn("slow"),r("#simDiv>.pace").fadeOut("fast"),"function"==typeof t&&t()},t.prototype.initViews=function(){var t=r("#systemValuesView"),e=r("#robotIndex");t.html("");var s="",i=this.robots[0]instanceof a.RobotBaseMobile?this.robots[0].chassis.geom.color:"#ffffff";if(s+='<select id="robotIndex" style="background-color:'+i+'">',this.robots.forEach((function(t){var e=t instanceof a.RobotBaseMobile?t.chassis.geom.color:"#ffffff";s+='<option style="background-color:'+e+'" value="'+t.id+'">'+t.name+"</option>"})),s+="</select>",t.append('<div><label id="robotLabel">Program Name</label><span style="width:auto">'+s+"</span></div>"),e.off("change.sim"),this.robots.length>1){var o=this;e.on("change.sim",(function(){var t=Number(r(this).val());o.robots[t].selected=!0,o.sim.selectionListener.fire(null)}))}},t.prototype.initEvents=function(){var t=this,e=0;r(window).off("resize.sim").on("resize.sim",(function(s,r){e>3?(t.centerBackground(!1),e=0):e++})),r("#robotLayer").off("keydown.sim").on("keydown.sim",this.handleKeyEvent.bind(this))},t.prototype.loadBackgroundImages=function(t){var e,r;r=s.isIE()?".png":".svg";for(var i=(e=this.robots[0].mobile?this.robots[0].imgList.map((function(t){return t.endsWith("jpg")?t:"".concat(t).concat(r)})):[this.robotType+"Background"+r]).length,o=this,a=function(){if(0==--i&&(t(),s.isLocalStorageAvailable()&&o.robots[0].mobile)){var e=localStorage.getItem("customBackground");if(e){try{JSON.parse(e)}catch(t){localStorage.setItem("customBackground",JSON.stringify({image:e,timestamp:(new Date).getTime()})),e=localStorage.getItem("customBackground")}var r=JSON.parse(e);if((new Date).getTime()-r.timestamp>54432e5)localStorage.removeItem("customBackground");else{var a=r.image,n=new Image;n.src="data:image/png;base64,"+a,o.imgBackgroundList.push(n),o.customBackgroundLoaded=!0}}}},n=0;n<e.length;){var h=this.imgBackgroundList[n]=new Image;h.onload=a,h.onerror=function(t){console.error(t)},h.src=this.imgPath+e[n++]}},t.prototype.loadImages=function(t,e,s){for(var r=0,i=t.length,o=function(){0==--i&&s()},a={};r<t.length;){var n=a[t[r]]=new Image;n.onload=o,n.onerror=function(t){console.error(t)},n.src=this.imgPath+e[r++]}return a},t.prototype.pasteObject=function(t){if(this.objectToCopy){var e=i.SimObjectFactory.copy(this.objectToCopy);e.moveTo(t),this.objectToCopy.type===i.SimObjectType.Obstacle?(this.obstacleList.push(e),this.redrawObstacles=!0):this.objectToCopy.type===i.SimObjectType.ColorArea?(this.colorAreaList.push(e),this.redrawColorAreas=!0):this.objectToCopy.type===i.SimObjectType.Marker&&(this.markerList.push(e),this.redrawMarkers=!0)}},t.prototype.resetAllCanvas=function(t){var e=this.sim.scale,s=(this.playground.w-(this.backgroundImg.width+20)*e)/2+25,i=(this.playground.h-(this.backgroundImg.height+20)*e)/2,o=Math.round((this.backgroundImg.width+20)*e),a=Math.round((this.backgroundImg.height+20)*e),n=r("#simDiv"),h=r("#canvasDiv");n.hasClass("shifting")&&n.hasClass("rightActive")&&h.css({top:i+"px",left:s+"px"}),this.oCtx.canvas.width=o,this.oCtx.canvas.height=a,this.rCtx.canvas.width=o,this.rCtx.canvas.height=a,this.dCtx.canvas.width=o,this.dCtx.canvas.height=a,this.bCtx.canvas.width=o,this.bCtx.canvas.height=a,this.aCtx.canvas.width=o,this.aCtx.canvas.height=a,t&&(this.uCanvas.width=this.backgroundImg.width+20,this.uCanvas.height=this.backgroundImg.height+20,this.udCanvas.width=this.backgroundImg.width+20,this.udCanvas.height=this.backgroundImg.height+20,this.uCtx.drawImage(this.backgroundImg,10,10,this.backgroundImg.width,this.backgroundImg.height),this.drawPattern(this.uCtx,!1)),this.bCtx.restore(),this.bCtx.save(),this.bCtx.drawImage(this.backgroundImg,10*e,10*e,this.backgroundImg.width*e,this.backgroundImg.height*e),this.drawPattern(this.bCtx,!0),this.dCtx.restore(),this.dCtx.save(),this.dCtx.drawImage(this.udCanvas,0,0,this.backgroundImg.width+20,this.backgroundImg.height+20,0,0,o,a),this.drawColorAreas(),this.drawObstacles(),this.drawMarkers()},t.prototype.centerBackground=function(t){var e=r("#simDiv"),s=r("#canvasDiv"),i=e.offset().top;this.playground.w=e.outerWidth()-50,this.playground.h=r(window).height()-i;var o=this.playground.w/(this.backgroundImg.width+20),a=this.playground.h/(this.backgroundImg.height+20);this.sim.scale=Math.min(o,a);var n=(this.playground.w-(this.backgroundImg.width+20)*this.sim.scale)/2+25,h=(this.playground.h-(this.backgroundImg.height+20)*this.sim.scale)/2;s.css({top:h+"px",left:n+"px"}),this.resetAllCanvas(t)},t.prototype.setRobotPoses=function(t){var e=this;t.forEach((function(t,s){e.robots[s]&&(e.robots[s].pose=new a.Pose(t[0].x,t[0].y,t[0].theta),e.robots[s].initialPose=new a.Pose(t[1].x,t[1].y,t[1].theta))}))},t.prototype.stepBackground=function(t){var e=2==this.currentBackground&&this.imgBackgroundList[2].currentSrc.includes("robertaBackground");e&&((s=this.obstacleList.find((function(t){return 0===t.myId})))&&(s.img=null));t<0?(this.currentBackground++,this.currentBackground%=this.imgBackgroundList.length):this.currentBackground=t,e=2==this.currentBackground&&this.imgBackgroundList[2].currentSrc.includes("robertaBackground");var s,r=this.sim.getConfigData();(this.obstacleList=[],this.colorAreaList=[],this.markerList=[],this.ground.w=this.imgBackgroundList[this.currentBackground].width,this.ground.h=this.imgBackgroundList[this.currentBackground].height,this.backgroundImg=this.imgBackgroundList[this.currentBackground],this.centerBackground(!0),this.sim.setNewConfig(r),e)&&((s=this.obstacleList.find((function(t){if(t.type===i.SimObjectType.Obstacle)return t.h=100,t.w=100,!0})))&&(s.img=this.images.roadWorks))},t.prototype.update=function(t,e){var s=this,r=this.obstacleList.slice();this.robots.forEach((function(t){return r.push(t.chassis)})),r.push(this.ground),this.robots.forEach((function(s){return s.updateActions(s,t,e)})),this.robots.forEach((function(i){return i.updateSensors(e,t,s.uCtx,s.udCtx,r,s.markerList)})),this.draw(t,e)},t.prototype.toggleTrail=function(){this.robots.forEach((function(t){t.hasTrail=!t.hasTrail,t.pose.xOld=t.pose.x,t.pose.yOld=t.pose.y}))},t.prototype.resetPoseAndDrawings=function(){this.robots.forEach((function(t){return t.resetPose()})),this.dCtx.canvas.width=this.dCtx.canvas.width,this.udCtx.canvas.width=this.udCtx.canvas.width},t.prototype.addMarker=function(t){this.addSimulationObject(this.markerList,i.SimObjectShape.Marker,i.SimObjectType.Marker,t),this._redrawMarkers=!0},t}();e.SimulationScene=n}));
//# sourceMappingURL=simulation.scene.js.map
//# sourceMappingURL=simulation.scene.js.map
