"use client";

import styles from "../../styles/CreateGroupe.module.css";
import { useHeader } from "src/components/Header";
import Input from "src/components/Input";
import { FormEvent, useState } from "react";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import { createGroup } from "src/services/group.service";
import { getCurrentUser } from "src/fire-base/auth";

export default function CreateGroupPage(){  
    const [groupName, setGroupName] = useState<string>("");
    const [emoji, setEmoji] = useState<string>("");
    useHeader("Ny Gruppe", "/")
    
    async function onSubmit(e: FormEvent) {
        e.preventDefault();  
        
        if (groupName && emoji){
          //Linjen under må endres når vi har ordnet access control 
          const user = getCurrentUser()
          if (user) {
            const UserID = user.uid
            const group = createGroup(UserID, groupName, emoji)
            //Finne en måte å route til gruppe-pagen her
          }
        }
    }

    return (
        <main className = {styles.container}>
          <div>
            <form className={styles.form}>
              <div className={styles.inputContainer}>
                <p className={styles.inputLabel}>Gruppenavn:</p>
                  <Input 
                    required
                    className={styles.inputStyle}
                    type = "text"
                    placeholder="Skriv gruppenavn..."
                    onInput={setGroupName}
                  />
              </div>
              <div className={styles.inputContainer}>
                <p className={styles.inputLabel}>Emoji:</p>
                        
                </div>
                <div className={styles.emojiContainer}>
                  <Input
                    required 
                    className={styles.emojiStyle}
                    type="text"
                    placeholder=""
                    onInput={setEmoji}
                    maxLength={2}
                  />
                </div> 
                <div>
                  <Button
                    className={styles["button-container"]}
                    variant={ButtonVariant.Round}
                    color={ButtonColor.Green}
                    onSubmit={e => onSubmit(e)}
                    type = "submit"
                  >
                    Opprett gruppe
                  </Button>
                </div>
            </form>
          </div>
        </main>
    )
}