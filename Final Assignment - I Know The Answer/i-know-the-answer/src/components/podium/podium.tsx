import { Avatar, Box } from "@chakra-ui/react";

interface PodiumProps {
  firstPlaceAvatar: string;
  secondPlaceAvatar: string;
  thirdPlaceAvatar: string;
}

export function Podium({
  firstPlaceAvatar,
  secondPlaceAvatar,
  thirdPlaceAvatar,
}: PodiumProps) {
  return (
    <Box
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      {thirdPlaceAvatar !== "" && (
        <Box
          style={{
            display: "grid",
            justifyItems: "center",
          }}
        >
          <Box
            style={{
              paddingBottom: 10,
            }}
          >
            <Avatar size="xl" src={thirdPlaceAvatar} />
          </Box>
          <Box
            style={{
              backgroundColor: "#f2f2f2",
              borderRadius: 6,
              display: "grid",
              placeContent: "center",
              fontSize: 30,
              fontWeight: 700,
              width: 200,
              height: 150,
            }}
          >
            3
          </Box>
        </Box>
      )}

      <Box
        style={{
          display: "grid",
          justifyItems: "center",
        }}
      >
        <Box
          style={{
            paddingBottom: 10,
          }}
        >
          <Avatar size="xl" src={firstPlaceAvatar} />
        </Box>
        <Box
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: 6,
            display: "grid",
            placeContent: "center",
            fontSize: 30,
            fontWeight: 700,
            width: 200,
            height: 300,
          }}
        >
          1
        </Box>
      </Box>

      <Box
        style={{
          display: "grid",
          justifyItems: "center",
        }}
      >
        <Box
          style={{
            paddingBottom: 10,
          }}
        >
          <Avatar size="xl" src={secondPlaceAvatar} />
        </Box>
        <Box
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: 6,
            display: "grid",
            placeContent: "center",
            fontSize: 30,
            fontWeight: 700,
            width: 200,
            height: 225,
          }}
        >
          2
        </Box>
      </Box>
    </Box>
  );
}
