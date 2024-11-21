import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { User, List, PlusCircle } from "lucide-react";
import EventLogInputPage from "./CreateNewEvent";
import { eventsArray } from "@/constants/Events";
import axios from "axios";
import toast from "react-hot-toast";
import DisplayEvents from "./DisplayEvents";

type EventData = {
  eventType: string;
  sourceAppId: string;
  timeStamp: string;
  payload: Record<string, any>;
};

type View = "Dashboard" | "EventLogInputPage";

export default function EventLogDashboard() {
  const [view, setView] = useState<View>("Dashboard");
  const [automation, setAutomation] = useState(false);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const createNewEvent = async () => {
      const randomIndex = Math.floor(Math.random() * eventsArray.length);
      const data: EventData = eventsArray[randomIndex];

      try {
        await axios.post("http://localhost:3000/api/events", {
          eventType: data.eventType,
          sourceAppId: data.sourceAppId,
          timeStamp: data.timeStamp,
          payload: data.payload,
        });

        setEventCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error(error);
        toast.error("Error while creating new event. Automation stopped.", {
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        // Stop automation on error
        setAutomation(false);
      }
    };

    if (automation) {
      interval = setInterval(createNewEvent, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [automation]);

  const toggleAutomation = () => {
    setAutomation((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      <Sidebar className="w-64">
        <SidebarHeader className="p-4">
          <h2 className="text-xl font-bold">Event Dashboard</h2>
        </SidebarHeader>
        <SidebarContent className="flex flex-col gap-2 p-4">
          <Button
            onClick={() => setView("Dashboard")}
            className="justify-start"
          >
            <List className="mr-2 h-4 w-4" />
            Display Events
          </Button>
          <Button
            onClick={() => setView("EventLogInputPage")}
            className="justify-start"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
          <Button
            onClick={toggleAutomation}
            className={
              automation
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }
          >
            {automation ? "Stop Automation" : "Start Automation"}
          </Button>

          <div className="text-sm text-gray-500">
            Status: {automation ? "Running" : "Stopped"}
          </div>

          <div className="text-sm text-gray-500">
            Events Created: {eventCount}
          </div>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            User Profile
          </Button>
        </SidebarFooter>
      </Sidebar>

      {view === "Dashboard" && <DisplayEvents />}
      {view === "EventLogInputPage" && <EventLogInputPage />}
    </div>
  );
}
