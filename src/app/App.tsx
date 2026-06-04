import { useEffect, useRef, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  BellRinging,
  DeviceMobile,
  ImageSquare,
  MusicNotes,
  Quotes,
} from "@phosphor-icons/react";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";
import { cn } from "@/app/components/ui/utils";

const featureTiles = [
  {
    label: "Alarm",
    icon: BellRinging,
    active: true,
  },
  {
    label: "Mantra",
    icon: Quotes,
    active: false,
  },
  {
    label: "Wallpaper",
    icon: ImageSquare,
    active: false,
  },
  {
    label: "Ringtone",
    icon: MusicNotes,
    active: false,
  },
];

const repeatDays = [
  { label: "Sun", shortLabel: "S" },
  { label: "Mon", shortLabel: "M" },
  { label: "Tue", shortLabel: "T" },
  { label: "Wed", shortLabel: "W" },
  { label: "Thu", shortLabel: "T" },
  { label: "Fri", shortLabel: "F" },
  { label: "Sat", shortLabel: "S" },
];
const hourValues = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);
const minuteValues = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const periodValues = ["AM", "PM"];
const wheelItemHeight = 48;
const wheelCycleCount = 21;
const wheelCenterCycle = Math.floor(wheelCycleCount / 2);

function App() {
  const [screen, setScreen] = useState<"home" | "alarm">("home");
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("PM");
  const [selectedDays, setSelectedDays] = useState(["Wed"]);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    window.history.replaceState({ screen: "home" }, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      const nextScreen = event.state?.screen === "alarm" ? "alarm" : "home";
      setScreen(nextScreen);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openAlarmScreen = () => {
    window.history.pushState({ screen: "alarm" }, "", window.location.href);
    setScreen("alarm");
  };

  const goBack = () => {
    if (screen === "alarm") {
      window.history.back();
      return;
    }

    setScreen("home");
  };

  const toggleDay = (day: string) => {
    setSelectedDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day],
    );
  };

  const toggleEveryDay = () => {
    setSelectedDays((currentDays) =>
      currentDays.length === repeatDays.length
        ? []
        : repeatDays.map((day) => day.label),
    );
  };

  return (
    <main className="h-dvh overflow-hidden bg-background text-foreground">
      {screen === "home" ? (
        <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-5 md:hidden">
          <header className="flex items-start gap-4">
            <div className="min-w-0">
              <p className="text-xs leading-5 text-muted-foreground">
                Good morning
              </p>
              <h1 className="text-xl font-medium leading-7 tracking-tight">
                Namaste! Avinash
              </h1>
            </div>
          </header>

          <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {featureTiles.map((tile) => {
              const Icon = tile.icon;

              return (
                <Button
                  key={tile.label}
                  variant="ghost"
                  className={cn(
                    "h-16 justify-start rounded-none border-0 px-4 text-base font-medium shadow-none",
                    (tile.label === "Alarm" || tile.label === "Wallpaper") &&
                      "border-r border-border",
                    (tile.label === "Alarm" || tile.label === "Mantra") &&
                      "border-b border-border",
                    tile.active
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "bg-card text-card-foreground hover:bg-accent/70",
                  )}
                >
                  <Icon className="size-5" weight="regular" aria-hidden />
                  <span>{tile.label}</span>
                </Button>
              );
            })}
          </div>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden pt-5">
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="w-full space-y-5">
                <div className="mx-auto flex aspect-square w-full max-w-[min(176px,23dvh)] items-center justify-center rounded-xl border border-dashed border-border bg-card text-muted-foreground shadow-sm">
                  <div className="flex size-16 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <ImageSquare className="size-8 opacity-70" weight="regular" aria-hidden />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-medium leading-7 tracking-tight">
                    Daily Alarm
                  </h2>
                  <p className="mx-auto max-w-[260px] text-sm leading-5 text-muted-foreground">
                    Set daily mantra and start your day with peace.
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="h-12 w-full rounded-md text-sm shadow-sm"
              onClick={openAlarmScreen}
            >
              Set Alarm
            </Button>
          </section>
        </section>
      ) : (
        <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-4 md:hidden">
          <header className="grid h-11 grid-cols-[2.5rem_1fr_2.5rem] items-center">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 justify-self-start rounded-md"
              onClick={goBack}
            >
              <CaretLeft className="size-6" weight="regular" aria-hidden />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-center text-xl font-medium leading-7 tracking-tight">
              Set Alarm
            </h1>
          </header>

          <div className="flex min-h-0 flex-1 flex-col pt-5">
            <Card className="gap-0 overflow-hidden rounded-xl border-border bg-card shadow-sm">
              <section className="px-4 py-5">
                <div className="relative grid grid-cols-[1fr_1fr_0.78fr] overflow-hidden rounded-lg border border-border bg-secondary p-2 text-center">
                  <div className="pointer-events-none absolute inset-x-2 top-1/2 h-12 -translate-y-1/2 rounded-md border border-border bg-card shadow-xs" />
                  <WheelPicker
                    values={hourValues}
                    value={hour}
                    onChange={setHour}
                  />
                  <WheelPicker
                    values={minuteValues}
                    value={minute}
                    onChange={setMinute}
                  />
                  <WheelPicker
                    values={periodValues}
                    value={period}
                    onChange={setPeriod}
                  />
                </div>
              </section>

              <section className="border-t border-border px-4 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-medium leading-6">Repeat</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      Choose active days.
                    </p>
                  </div>
                  <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                    <Switch
                      checked={selectedDays.length === repeatDays.length}
                      onCheckedChange={toggleEveryDay}
                    />
                    Every day
                  </label>
                </div>

                <div className="mt-5 grid grid-cols-7 overflow-hidden rounded-lg bg-secondary p-1">
                  {repeatDays.map((day) => {
                    const active = selectedDays.includes(day.label);

                    return (
                      <Button
                        key={day.label}
                        variant="ghost"
                        onClick={() => toggleDay(day.label)}
                        className={cn(
                          "h-9 rounded-md border-0 px-0 text-sm font-medium shadow-none",
                          active &&
                            "bg-primary text-primary-foreground hover:bg-primary/90",
                          !active &&
                            "bg-transparent text-muted-foreground hover:bg-background hover:text-foreground",
                        )}
                        aria-label={day.label}
                      >
                        {day.shortLabel}
                      </Button>
                    );
                  })}
                </div>
              </section>

              <button
                type="button"
                className="flex h-16 w-full items-center justify-between border-t border-border px-4 text-left transition-colors hover:bg-accent/70"
              >
                <span className="text-base font-medium leading-6">Mantra</span>
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  Select
                  <CaretRight className="size-4" aria-hidden />
                </span>
              </button>
            </Card>
          </div>

          <Button size="lg" className="h-11 w-full rounded-md text-sm shadow-sm">
            Set Alarm
          </Button>
        </section>
      )}

      <section className="hidden h-dvh items-center justify-center px-8 md:flex">
        <Card className="max-w-sm text-center shadow-lg">
          <CardHeader className="items-center">
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <DeviceMobile className="size-5" />
            </div>
            <CardTitle>Check this on mobile</CardTitle>
            <CardDescription>
              This app is designed mobile-first. Open the dev URL on your
              Android phone to review the home screen.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
}

function WheelPicker({
  values,
  value,
  onChange,
}: {
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasPositionedRef = useRef(false);
  const repeatedValues = Array.from(
    { length: values.length * wheelCycleCount },
    (_, index) => values[index % values.length],
  );

  useEffect(() => {
    if (hasPositionedRef.current) {
      return;
    }

    const selectedIndex = Math.max(values.indexOf(value), 0);
    const centeredIndex = wheelCenterCycle * values.length + selectedIndex;

    scrollRef.current?.scrollTo({
      top: centeredIndex * wheelItemHeight,
      behavior: "auto",
    });
    hasPositionedRef.current = true;
  }, [value, values]);

  const handleScroll = () => {
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    const rawIndex = Math.round(scrollTop / wheelItemHeight);
    const normalizedIndex = (
      (rawIndex % values.length) +
      values.length
    ) % values.length;
    const nextValue = values[normalizedIndex];
    const shouldRecenter =
      rawIndex < values.length * 2 ||
      rawIndex > values.length * (wheelCycleCount - 2);

    if (shouldRecenter) {
      window.requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top:
            (wheelCenterCycle * values.length + normalizedIndex) *
            wheelItemHeight,
          behavior: "auto",
        });
      });
    }

    if (nextValue !== value) {
      onChange(nextValue);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="relative z-10 h-36 snap-y snap-mandatory overflow-y-auto py-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onScroll={handleScroll}
    >
      {repeatedValues.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={cn(
            "flex h-12 snap-center items-center justify-center text-xl font-medium tabular-nums transition-colors",
            item === value
              ? "text-foreground"
              : "text-muted-foreground/50",
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default App;
