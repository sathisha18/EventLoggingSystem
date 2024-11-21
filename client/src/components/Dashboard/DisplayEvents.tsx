import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter, RefreshCw } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { eventTypesArray } from "../../constants/Events";

type EventType = {
  eventType: string;
  sourceAppId: string;
  timeStamp: string;
  payload: unknown;
};

const SkeletonLoader = () => (
  <TableBody>
    {[...Array(10)].map((_, index) => (
      <TableRow key={index} className="animate-pulse">
        <TableCell>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

const DisplayEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(1);
  const noOfEventsPerPage = 10;

  const totalPages = Math.ceil(totalEvents / noOfEventsPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const [filters, setFilters] = useState({
    eventType: "",
    sourceAppId: "",
    startDate: "",
    endDate: "",
  });

  const fetchEvents = async () => {
    const params = new URLSearchParams({
      limit: noOfEventsPerPage.toString(),
      page: currentPage.toString(),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const url = `http://localhost:3000/api/events?${params.toString()}`;
    setLoading(true);
    try {
      const response = await axios.get(url);
      // console.log(response.data.messages.totalSize);

      setTotalEvents(response?.data?.messages?.totalSize);
      setEvents(response?.data?.messages?.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full bg-gray-100">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-sm md:text-base">
            <Filter className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Event Log Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, eventType: value }))
            }
          >
            <SelectTrigger className="w-full md:w-auto">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypesArray.map((event: string) => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="SourceApplicationId"
            className="w-full md:w-auto"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sourceAppId: e.target.value }))
            }
          />
          <Input
            type="date"
            className="w-full md:w-auto"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />

          <Input
            type="date"
            className="w-full md:w-auto"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
          <Button
            onClick={() => {
              setCurrentPage(1);
              fetchEvents();
            }}
            variant="outline"
            className="w-full md:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">Event Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs md:text-sm">Event Type</TableHead>
                <TableHead className="text-xs md:text-sm">Timestamp</TableHead>
                <TableHead className="text-xs md:text-sm">Source App</TableHead>
                <TableHead className="text-xs md:text-sm">Payload</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <TableBody>
                {events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs md:text-sm">
                      {event.eventType}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {new Date(event.timeStamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {event.sourceAppId}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm truncate max-w-[200px]">
                      {JSON.stringify(event.payload)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="w-full md:w-24"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Prev
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="w-full md:w-24"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DisplayEvents;
