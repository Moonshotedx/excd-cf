import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import {
  ExcalidrawImperativeAPI,
  SocketId,
} from "@excalidraw/excalidraw/types";
import {
  BufferEventType,
  ExcalidrawElementChange,
  ExcalidrawElementChangeSchema,
  PointerEvent,
  PointerEventSchema,
} from "@repo/schemas/events";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import useBufferedWebSocket from "../hooks/excalidraw-socket";

function ExcalidrawComponent() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const { id } = useParams({ from: "/excalidraw/$id" });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get userId from localStorage first
    const storedId = localStorage.getItem("userId");

    if (storedId) {
      setUserId(storedId);
    } else {
      // Generate a new ID if none exists
      const id = Math.random().toString(36).substring(2, 15);
      // Save the ID to localStorage for future use
      localStorage.setItem("userId", id);
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    // Try to get userId from localStorage first
    const storedId = localStorage.getItem("userId");

    if (storedId) {
      setUserId(storedId);
    } else {
      // Generate a new ID if none exists
      const id = Math.random().toString(36).substring(2, 15);
      // Save the ID to localStorage for future use
      localStorage.setItem("userId", id);
      setUserId(id);
    }
  }, []);

  const handleMessage = (event: BufferEventType) => {
    if (event.type === "pointer") {
      handlePointerEvent(event);
    } else if (event.type === "elementChange") {
      handleElementChangeEvent(event);
    }
  };

  const handlePointerEvent = (event: PointerEvent) => {
    if (excalidrawAPI) {
      const allCollaborators = excalidrawAPI.getAppState().collaborators;
      const colaborator = new Map(allCollaborators);
      colaborator.set(event.data.userId as SocketId, {
        username: event.data.userId,
        pointer: {
          x: event.data.x,
          y: event.data.y,
          tool: "laser",
        },
      });
      if (userId) {
        colaborator.delete(userId as SocketId);
      }
      excalidrawAPI.updateScene({
        collaborators: colaborator,
      });
    }
  };

  const handleElementChangeEvent = (event: ExcalidrawElementChange) => {
    if (excalidrawAPI) {
      // Update the scene with the new elements
      excalidrawAPI.updateScene({
        elements: event.data,
      });
      console.log("Element change received:", event.data);
    }
  };

  const sendEventViaSocket = useBufferedWebSocket(handleMessage, id);

  return (
    <div className="canvas" style={{ height: "100vh", width: "100%" }}>
      <Excalidraw
        onPointerUpdate={(payload) => {
          sendEventViaSocket(
            PointerEventSchema.parse({
              type: "pointer",
              data: {
                userId: userId,
                x: payload.pointer.x,
                y: payload.pointer.y,
              },
            })
          );
        }}
        onPointerUp={() => {
          if (excalidrawAPI) {
            sendEventViaSocket(
              ExcalidrawElementChangeSchema.parse({
                type: "elementChange",
                data: excalidrawAPI.getSceneElements(),
              })
            );
          }
        }}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
      />
    </div>
  );
}

export default ExcalidrawComponent;
