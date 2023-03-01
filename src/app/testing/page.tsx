"use client";

import { ControllerIcon } from "src/assets/icons/ControllerIcon";
import { GroupIcon } from "src/assets/icons/GroupIcon";
import { PersonIcon } from "src/assets/icons/PersonIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import AuthTester from "../../components/AuthTester";
import styles from "../../styles/Testing.module.css";

export default function TestingPage() {
  return (
    <main className={styles.container}>
      <div>
        <h1>h1</h1>
        <h2>h2</h2>
        <h3>h3</h3>
        <h4>h4</h4>
        <h5>h5</h5>
        <h6>h6</h6>
      </div>

      <div>
        <strong>Strong text</strong>
        <p>Primary text</p>
        <p className={styles.secondary}>Secondary text</p>
      </div>

      <div className="form-group">
        <form className={styles.form}>
          <input type="text" placeholder="Text Input" />
          <textarea rows={6} placeholder="Textarea" />
          <button>Submit Button</button>
        </form>
      </div>
      <Button  variant={ButtonVariant.Action}>
        <ControllerIcon />
      </Button>
      <Button  variant={ButtonVariant.Action} color={ButtonColor.Red}>
        <GroupIcon />
      </Button>
      <Button  variant={ButtonVariant.Action} color={ButtonColor.Pink}>
        <PersonIcon />
      </Button>
      <Button variant={ButtonVariant.Small}>
        Liten knapp
      </Button>
      <Button variant={ButtonVariant.Medium}>
        Medium knapp
      </Button>
      <Button variant={ButtonVariant.Round} color={ButtonColor.Pink}>
        Rund knapp
      </Button>
      <AuthTester />
    </main>
  );
}
