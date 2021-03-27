import Image from "next/image";

import styles from '../styles/voteButton.module.css'

export default function VoteButton(props) {
    return <div className={`col-auto m-1 ${styles.iconButton}`} style={{ height: props.height ?? "30px", padding: "10px" }}>
        <Image
            src={props.iconPath}
            alt={props.alt}
            onClick={props.onClick}
            layout="fill"
        />
    </div>
}