
import { Matchroom } from "../../types/matchroom"


interface MatchroomItemProps {
    item: Matchroom;
}

export const MatchroomItem = ({ item } : MatchroomItemProps) => {
    return (
        <div>
            <div>{item.title}</div>
            <div>{item.playerCount}/4</div>
        </div>
    )
}