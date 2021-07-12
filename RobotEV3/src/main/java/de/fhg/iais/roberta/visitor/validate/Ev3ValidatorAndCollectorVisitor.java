package de.fhg.iais.roberta.visitor.validate;

import com.google.common.collect.ClassToInstanceMap;

import de.fhg.iais.roberta.bean.IProjectBean;
import de.fhg.iais.roberta.bean.UsedHardwareBean;
import de.fhg.iais.roberta.components.ConfigurationAst;
import de.fhg.iais.roberta.components.UsedActor;
import de.fhg.iais.roberta.syntax.SC;
import de.fhg.iais.roberta.syntax.action.speech.SayTextAction;
import de.fhg.iais.roberta.syntax.action.speech.SetLanguageAction;
import de.fhg.iais.roberta.syntax.sensor.generic.TimerSensor;
import de.fhg.iais.roberta.typecheck.NepoInfo;
import de.fhg.iais.roberta.visitor.hardware.IEv3Visitor;

public class Ev3ValidatorAndCollectorVisitor extends CommonNepoValidatorAndCollectorVisitor implements IEv3Visitor<Void> {

    protected Ev3ValidatorAndCollectorVisitor(
        ConfigurationAst robotConfiguration,
        ClassToInstanceMap<IProjectBean.IBuilder<?>> beanBuilders) {
        super(robotConfiguration, beanBuilders);
    }

    @Override
    public Void visitSetLanguageAction(SetLanguageAction<Void> setLanguageAction) {
        return null;
    }

    @Override
    public Void visitSayTextAction(SayTextAction<Void> sayTextAction) {
        if ( this.robotConfiguration.getRobotName().equals("ev3lejosv0") ) {
            sayTextAction.addInfo(NepoInfo.warning("BLOCK_NOT_SUPPORTED"));
        }
        requiredComponentVisited(sayTextAction, sayTextAction.getMsg());
        this.getBuilder(UsedHardwareBean.Builder.class).addUsedActor(new UsedActor(SC.VOICE, SC.VOICE));
        return null;

    }

    @Override
    public Void visitTimerSensor(TimerSensor<Void> timerSensor) {
        return null;
    }
}
