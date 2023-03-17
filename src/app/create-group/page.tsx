"use client";

import styles from "../../styles/CreateGroupe.module.css";
import { Header } from "src/components/Header";
import Input from "src/components/Input";
import { useState } from "react";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";

export default function CreateGroupPage(){
    const [groupName, setGroupName] = useState<string>("");
    const [emoji, setEmoji] = useState<string>("");

    return (
        <main className = {styles.container}>
            <Header> Ny gruppe </Header>
            <div>

                <form>
                    <div className={styles.form}>
                        <p className={styles.inputLabel}>Gruppenavn:</p>
                        <Input 
                            type = "text"
                            placeholder="Skriv gruppenavn..."
                            onInput={setGroupName} />
                            </div>
                    <div className={styles.form}>
                        <p className={styles.inputLabel}>Emoji:</p>
                        
                    </div>
                        <div className={styles.setEmoji}>
                        <Input
                            type="text"
                            placeholder=""
                            onInput={setEmoji}
                            maxLength="2"
                            size="1"
                            />
                            </div>
                        
                        <div>
                        <Button
                            className={styles["button-container"]}
                            variant={ButtonVariant.Round}
                            color={ButtonColor.Green}
                            >
                                Opprett gruppe
                        </Button>
                        </div>
                </form>

                
            </div>
        </main>
    )
}