import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../../components/ui/dialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Textarea } from "../../components/ui/textarea";
import { ThreeDotsIcon } from "../../assets/svg/ThreeDotsIcon";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const reportCategories = [
  {
    value: "SPAM",
    label: "Spam",
  },
  {
    value: "INAPPROPRIATE",
    label: "Inappropriate",
  },
  {
    value: "HARASSMENT",
    label: "Harassment",
  },
  {
    value: "MISINFORMATION",
    label: "Misinformation",
  },
  {
    value: "COPYRIGHT_VIOLATION",
    label: "Copyright violation",
  },
  {
    value: "HATE_SPEECH",
    label: "Hate speech",
  },
  {
    value: "VIOLENCE",
    label: "Violence",
  },
  {
    value: "SELF_HARM",
    label: "Self harm",
  },
  {
    value: "ILLEGAL_ACTIVITY",
    label: "Illegal activity",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const ReportPost = memo(({ postId }: { postId: string }) => {
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleReportPost = async () => {
    if (!value) {
      toast.error("Please select a reason type");
      return;
    }
    if (!message) {
      toast.error("Please add a detailed reason");
      return;
    }
    try {
      toast.success("Post reported successfully");
      setDialogOpen(false);
      setMessage("");
      setValue("");
      await axios.post(
        `/post/report/${postId}`,
        {
          type: value,
          reason: message,
        },
        {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error: any) {
      return;
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>
          <ThreeDotsIcon size={18} />
        </DialogTrigger>
        <DialogContent className="bg-cdark-300 border border-alphaborder">
          <DialogHeader>
            <DialogTitle>Report Unappropriate Post</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Make sure that you have a valid
              reason before reporting someone's post.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm font-semibold">Reason type</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between bg-cdark-300 border border-alphaborder"
              >
                {value
                  ? reportCategories.find(
                      (category) => category.value === value
                    )?.label
                  : "Select Reason..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command className="bg-cdark-300 text-white border border-alphaborder">
                <CommandInput placeholder="Search Reasons..." />
                <CommandList>
                  <CommandEmpty>No Results found.</CommandEmpty>
                  <CommandGroup>
                    {reportCategories.map((category) => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === category.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="grid w-full gap-3.5 py-1.5">
            <p className="text-sm font-semibold">Detailed Reason</p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="py-2 border border-alphaborder"
              style={{ maxHeight: "100px", resize: "vertical" }}
              placeholder="Type your message here."
              id="message"
            />
          </div>
          <Button
            onClick={handleReportPost}
            variant="secondary"
            aria-expanded={open}
            className="text-black font-semibold"
          >
            Report
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default ReportPost;
