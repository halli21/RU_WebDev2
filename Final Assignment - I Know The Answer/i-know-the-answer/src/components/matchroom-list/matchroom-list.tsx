import { Button } from '@chakra-ui/react'

import { Matchroom } from '../../types/matchroom';
import { MatchroomItem } from '../matchroom-item/matchroom-item';


const matchrooms: Matchroom[] = [
    {
        title: "Capitals in europe",
        playerCount: 3,
    },
    {
        title: "Presidents of US",
        playerCount: 1,
    },
    {
        title: "Literature I",
        playerCount: 4,
    },
    {
        title: "Video games",
        playerCount: 2,
    },
    {
        title: "Extra",
        playerCount: 4,
    },
];



export const MatchRoomList = () => {
    return (
        <div>
            <h1>Matchrooms</h1>
            <Button>Create</Button>
            {matchrooms.map((item) => (
                <MatchroomItem key={item.title} item={item} />

            ))}
        </div>
    )
}