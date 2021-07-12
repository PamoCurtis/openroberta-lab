package de.fhg.iais.roberta.worker.validate;

import com.google.common.collect.ClassToInstanceMap;

import de.fhg.iais.roberta.bean.IProjectBean;
import de.fhg.iais.roberta.components.Project;
import de.fhg.iais.roberta.visitor.validate.C4ev3SimValidatorAndCollectorVisitor;
import de.fhg.iais.roberta.visitor.validate.CommonNepoValidatorAndCollectorVisitor;
import de.fhg.iais.roberta.worker.AbstractValidatorAndCollectorWorker;

public class C4ev3SimValidatorAndCollectorWorker extends AbstractValidatorAndCollectorWorker {
    @Override
    protected CommonNepoValidatorAndCollectorVisitor getVisitor(Project project, ClassToInstanceMap<IProjectBean.IBuilder<?>> beanBuilders) {
        return new C4ev3SimValidatorAndCollectorVisitor(project.getConfigurationAst(), beanBuilders);
    }
}
