"use client"

import Input from "src/components/Input"
import styles from "../../styles/Testing.module.css"

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

      <div>
        <Input type="text" placeholder="Text Input" onInput={console.log} />
        <br/>
        <br/>
        <Input type="email" placeholder="Email Input" onInput={console.log} />
        <br/>
        <br/>
        <Input type="password" placeholder="Password Input" onInput={console.log} />
        <br/>
        <br/>
        <Input type="number" placeholder="Number Input" defaultValue={5} onInput={console.log} />
        <br/>
        <br/>
        <Input type="textarea" rows={6} placeholder="TextArea Input" onInput={console.log} />
        <br/>
        <br/>
        <Input type="checkbox" onInput={console.log} />
        <br/>
        <br/>
        <Input type="toggle" onInput={console.log} />
      </div>
    </main>
  )
}