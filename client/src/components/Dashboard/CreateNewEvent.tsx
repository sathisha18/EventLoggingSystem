import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import * as z from "zod";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const eventTypes = [
  "SYSTEM_START",
  "SYSTEM_SHUTDOWN",
  "SERVICE_HEALTH_CHECK",
  "RESOURCE_THRESHOLD_EXCEEDED",
  "SYSTEM_UPDATE",
  "SYSTEM_RESOURCE_ALLOCATION",
  "SYSTEM_RESTART",
  "FAILOVER_INITIATED",
] as const;

const eventLogSchema = z.object({
  eventType: z.enum(eventTypes, {
    required_error: "Please select an event type.",
  }),
  sourceAppId: z.string().min(1, "Source App ID is required"),
  timeStamp: z.string().min(1, "Date is required"),
  payload: z.object({
    message: z.string().min(1, "Payload message is required"),
  }),
});

type EventLogFormValues = z.infer<typeof eventLogSchema>;

const defaultValues: Partial<EventLogFormValues> = {
  eventType: undefined,
  sourceAppId: "",
  timeStamp: "",
  payload: {
    message: "",
  },
};

export default function EventLogInputPage() {
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] =
    React.useState<EventLogFormValues | null>(null);

  const form = useForm<EventLogFormValues>({
    resolver: zodResolver(eventLogSchema),
    defaultValues,
  });

  const onSubmit = async (data: EventLogFormValues) => {
    console.log("Data is ");
    console.log(data);
    setLoading(true);
    setSubmittedData(null);
    await axios
      .post("http://localhost:3000/api/events", {
        eventType: data.eventType,
        sourceAppId: data.sourceAppId,
        timeStamp: data.timeStamp,
        payload: data.payload,
      })
      .then((res) => {
        setSubmittedData(data);
        toast.success(res.data.message, {
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      })
      .catch(() => {
        toast.error("Please try again after some time.", {
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Event Log Input</CardTitle>
          <CardDescription>
            Enter the details for the event log.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sourceAppId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source App ID</FormLabel>
                    <FormControl>
                      <Input placeholder="App1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeStamp"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Timestamp</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(
                                format(date, "yyyy-MM-dd HH:mm:ss"),
                              ); // Formats date as string
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payload.message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payload Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="System started successfully"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {loading ? "Loading..." : "Submit Event Log"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {submittedData && (
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Submitted Event Log</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
