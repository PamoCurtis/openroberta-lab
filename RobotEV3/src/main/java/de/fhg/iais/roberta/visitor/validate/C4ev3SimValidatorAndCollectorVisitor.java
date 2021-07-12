package de.fhg.iais.roberta.visitor.validate;

import com.google.common.collect.ClassToInstanceMap;

import de.fhg.iais.roberta.bean.IProjectBean;
import de.fhg.iais.roberta.components.ConfigurationAst;

public class C4ev3SimValidatorAndCollectorVisitor extends Ev3ValidatorAndCollectorVisitor {
    public C4ev3SimValidatorAndCollectorVisitor(ConfigurationAst configurationAst, ClassToInstanceMap<IProjectBean.IBuilder<?>> beanBuilders) {
        super(configurationAst, beanBuilders);
    }
}
