package de.fhg.iais.roberta.ast.syntax.actors;

import org.junit.Test;

import de.fhg.iais.roberta.codegen.lejos.Helper;

public class ShowTextActionTest {
    @Test
    public void clearDisplay() throws Exception {
        String a = "\nhal.drawText(\"Hallo\", 0, 0);";

        Helper.assertCodeIsOk(a, "/ast/actions/action_ShowText.xml");

    }
}
