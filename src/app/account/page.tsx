"use client"

import { useHeader } from "src/components/Header"
import Input from "src/components/Input"
import { useState, FormEvent } from "react"

export default function AccountPage() {
  useHeader("Profil", "/")

  const [password, setPassword] = useState<string>("")
  const [confPassword, setConfPassword] = useState<string>("")

  async function handleSubmit(e: FormEvent) {
    
  }

  return (
    <main>
      <form>
        <strong>Endre password</strong>
        <Input
          type="password"
          placeholder="Nytt passord"
          onInput={setPassword}
        />
        <Input
          type="password"
          placeholder="Bekreft passord"
          onInput={setConfPassword}
        />
      </form>
    </main>
  )
}