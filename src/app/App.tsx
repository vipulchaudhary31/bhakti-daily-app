import { useEffect, useRef, useState } from "react";
import {
  BellRinging,
  CaretLeft,
  CaretRight,
  Check,
  DeviceMobile,
  Copy,
  House,
  ImageSquare,
  Lock,
  MusicNotes,
  Pause,
  Play,
  Plus,
  Quotes,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Toaster } from "@/app/components/ui/sonner";
import { Switch } from "@/app/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { cn } from "@/app/components/ui/utils";
import { toast } from "sonner";

type Screen =
  | "home"
  | "alarm"
  | "alarm-mantra"
  | "ringtone"
  | "wallpaper"
  | "mantra-choose"
  | "mantra-count"
  | "mantra-session";
type HomeFeature = "Alarm" | "Mantra" | "Wallpaper" | "Ringtone";

type MantraTrack = {
  id: string;
  title: string;
  deity: string;
  duration: string;
  audioSrc: string;
};

type SavedAlarm = {
  id: string;
  hour: string;
  minute: string;
  period: string;
  repeatDays: string[];
  enabled: boolean;
  mantraId: string;
};

type RingtoneTrack = {
  id: string;
  title: string;
  category: string;
  duration: string;
  audioSrc: string;
};

type WallpaperOption = {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
};

type WallpaperPlacement = "lock" | "home" | "both";
type MantraCountOption = "11" | "21" | "51" | "100" | "540" | "infinite";

const featureTiles: Array<{
  label: string;
  icon: Icon;
}> = [
  {
    label: "Alarm",
    icon: BellRinging,
  },
  {
    label: "Mantra",
    icon: Quotes,
  },
  {
    label: "Wallpaper",
    icon: ImageSquare,
  },
  {
    label: "Ringtone",
    icon: MusicNotes,
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
const wheelItemHeight = 40;
const wheelCycleCount = 21;
const wheelCenterCycle = Math.floor(wheelCycleCount / 2);
const mantraFilters = [
  "All",
  "Khatu Shyam",
  "Lord Ganesh",
  "Lord Hanuman",
  "Ramji",
  "Shivji",
  "Krishna",
];
const mantraTracks: MantraTrack[] = [
  {
    id: "ramji-bhajan",
    title: "Ramji Bhajan",
    deity: "Ramji",
    duration: "1:28",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "khatu-shyam-aarti",
    title: "Khatu Shyam Aarti",
    deity: "Khatu Shyam",
    duration: "2:14",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "ganesh-mantra",
    title: "Ganesh Mantra",
    deity: "Lord Ganesh",
    duration: "1:46",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "hanuman-chalisa-short",
    title: "Hanuman Chalisa",
    deity: "Lord Hanuman",
    duration: "2:03",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "shiv-dhun",
    title: "Shiv Dhun",
    deity: "Shivji",
    duration: "1:57",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "krishna-flute-bhajan",
    title: "Krishna Flute Bhajan",
    deity: "Krishna",
    duration: "2:21",
    audioSrc: "/gimme-that-groove.mp3",
  },
];

const ringtoneTracks: RingtoneTrack[] = [
  {
    id: "temple-bells",
    title: "Temple Bells",
    category: "Temple",
    duration: "1:18",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "sunrise-chime",
    title: "Sunrise Chime",
    category: "Chimes",
    duration: "1:09",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "soft-conch",
    title: "Soft Conch",
    category: "Temple",
    duration: "1:26",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "sandalwood-bells",
    title: "Sandalwood Bells",
    category: "Temple",
    duration: "1:14",
    audioSrc: "/gimme-that-groove.mp3",
  },
  {
    id: "morning-aarti",
    title: "Morning Aarti",
    category: "Devotional",
    duration: "1:31",
    audioSrc: "/gimme-that-groove.mp3",
  },
];
const ringtoneFilters = ["All", "Temple", "Chimes", "Devotional"];
const wallpaperFilters = ["All", "Temple", "Sunrise", "Minimal", "Nature"];
const wallpaperOptions: WallpaperOption[] = [
  {
    id: "saffron-dawn",
    title: "Saffron Dawn",
    category: "Sunrise",
    imageSrc: "/wallpapers/saffron-dawn.jpg",
  },
  {
    id: "lake-stillness",
    title: "Lake Stillness",
    category: "Nature",
    imageSrc: "/wallpapers/lake-stillness.jpg",
  },
  {
    id: "temple-light",
    title: "Temple Light",
    category: "Temple",
    imageSrc: "/wallpapers/temple-light.jpg",
  },
  {
    id: "quiet-tree",
    title: "Quiet Tree",
    category: "Sunrise",
    imageSrc: "/wallpapers/quiet-tree.jpg",
  },
  {
    id: "rolling-hills",
    title: "Rolling Hills",
    category: "Minimal",
    imageSrc: "/wallpapers/rolling-hills.jpg",
  },
];
const mantraCountOptions: Array<{
  value: MantraCountOption;
  label: string;
  description: string;
}> = [
  { value: "11", label: "11", description: "Short session" },
  { value: "21", label: "21", description: "Gentle focus" },
  { value: "51", label: "51", description: "Steady rhythm" },
  { value: "100", label: "100", description: "Deep practice" },
  { value: "540", label: "540", description: "Long session" },
  { value: "infinite", label: "Infinite", description: "Until you stop" },
];

function usePreviewAudio(src?: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeRef = useRef(false);

  useEffect(() => {
    if (!src) {
      setIsPlaying(false);
      audioRef.current = null;
      return;
    }

    shouldResumeRef.current = isPlaying;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.preload = "auto";
    audioRef.current = audio;
    setIsPlaying(false);

    const handleEnded = () => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    };

    audio.addEventListener("ended", handleEnded);

    if (shouldResumeRef.current) {
      void audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [src]);

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      stop();
      return;
    }

    audio.currentTime = 0;
    await audio.play();
    setIsPlaying(true);
  };

  const play = async () => {
    const audio = audioRef.current;
    if (!audio || isPlaying) return;

    audio.currentTime = 0;
    await audio.play();
    setIsPlaying(true);
  };

  return { isPlaying, toggle, stop, play };
}

function App() {
  const initialScreenParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("screen")
      : null;
  const [screen, setScreen] = useState<Screen>("home");
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("PM");
  const [selectedDays, setSelectedDays] = useState(["Wed"]);
  const [selectedMantraId, setSelectedMantraId] = useState("ramji-bhajan");
  const [selectedMantraFilter, setSelectedMantraFilter] = useState("All");
  const [selectedChantMantraId, setSelectedChantMantraId] =
    useState("ramji-bhajan");
  const [selectedChantCount, setSelectedChantCount] =
    useState<MantraCountOption>("11");
  const [savedChantMantraId, setSavedChantMantraId] = useState<string | null>(null);
  const [savedChantCount, setSavedChantCount] =
    useState<MantraCountOption>("11");
  const [savedAlarms, setSavedAlarms] = useState<SavedAlarm[]>([]);
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [activeHomeFeature, setActiveHomeFeature] =
    useState<HomeFeature>("Alarm");
  const [selectedRingtoneId, setSelectedRingtoneId] =
    useState("temple-bells");
  const [selectedRingtoneFilter, setSelectedRingtoneFilter] =
    useState("All");
  const [savedRingtoneId, setSavedRingtoneId] = useState<string | null>(null);
  const [selectedWallpaperId, setSelectedWallpaperId] = useState<string | null>(
    null,
  );
  const [selectedWallpaperFilter, setSelectedWallpaperFilter] =
    useState("All");
  const [lockWallpaperId, setLockWallpaperId] = useState<string | null>(null);
  const [homeWallpaperId, setHomeWallpaperId] = useState<string | null>(null);
  const [wallpaperEditorTarget, setWallpaperEditorTarget] =
    useState<WallpaperPlacement | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
  const initialScreen =
      initialScreenParam === "alarm" ||
      initialScreenParam === "alarm-mantra" ||
      initialScreenParam === "ringtone" ||
      initialScreenParam === "wallpaper" ||
      initialScreenParam === "mantra-choose" ||
      initialScreenParam === "mantra-count" ||
      initialScreenParam === "mantra-session"
        ? initialScreenParam
        : "home";

    setScreen(initialScreen);
    window.history.replaceState({ screen: initialScreen }, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      const nextScreen = event.state?.screen;
      setScreen(
        nextScreen === "alarm" ||
          nextScreen === "alarm-mantra" ||
          nextScreen === "ringtone" ||
          nextScreen === "wallpaper" ||
          nextScreen === "mantra-choose" ||
          nextScreen === "mantra-count" ||
          nextScreen === "mantra-session"
          ? nextScreen
          : "home",
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialScreenParam]);

  const openAlarmScreen = () => {
    setEditingAlarmId(null);
    window.history.pushState({ screen: "alarm" }, "", window.location.href);
    setScreen("alarm");
  };

  const openExistingAlarm = (alarm: SavedAlarm) => {
    setEditingAlarmId(alarm.id);
    setHour(alarm.hour);
    setMinute(alarm.minute);
    setPeriod(alarm.period);
    setSelectedDays(alarm.repeatDays);
    setSelectedMantraId(alarm.mantraId);
    window.history.pushState({ screen: "alarm" }, "", window.location.href);
    setScreen("alarm");
  };

  const openMantraScreen = () => {
    window.history.pushState({ screen: "alarm-mantra" }, "", window.location.href);
    setScreen("alarm-mantra");
  };

  const openChantingMantraScreen = () => {
    setSelectedChantMantraId(savedChantMantraId ?? "ramji-bhajan");
    setSelectedMantraFilter("All");
    window.history.pushState({ screen: "mantra-choose" }, "", window.location.href);
    setScreen("mantra-choose");
  };

  const openMantraCountScreen = () => {
    window.history.pushState({ screen: "mantra-count" }, "", window.location.href);
    setScreen("mantra-count");
  };

  const openMantraSessionScreen = () => {
    window.history.pushState({ screen: "mantra-session" }, "", window.location.href);
    setScreen("mantra-session");
  };

  const openRingtoneScreen = () => {
    window.history.pushState({ screen: "ringtone" }, "", window.location.href);
    setScreen("ringtone");
  };

  const openWallpaperScreen = () => {
    const sharedWallpaperId =
      lockWallpaperId && lockWallpaperId === homeWallpaperId
        ? lockWallpaperId
        : null;
    setWallpaperEditorTarget(null);
    setSelectedWallpaperId(sharedWallpaperId);
    window.history.pushState({ screen: "wallpaper" }, "", window.location.href);
    setScreen("wallpaper");
  };

  const openWallpaperScreenForTarget = (target: WallpaperPlacement) => {
    setWallpaperEditorTarget(target);
    setSelectedWallpaperId(
      target === "lock" ? lockWallpaperId : target === "home" ? homeWallpaperId : null,
    );
    window.history.pushState({ screen: "wallpaper" }, "", window.location.href);
    setScreen("wallpaper");
  };

  const goBack = () => {
    if (screen !== "home") {
      window.history.back();
      return;
    }

    setScreen("home");
  };

  const setRepeatDays = (days: string[]) => {
    setSelectedDays(repeatDays.map((day) => day.label).filter((day) => days.includes(day)));
  };

  const toggleEveryDay = () => {
    setSelectedDays((currentDays) =>
      currentDays.length === repeatDays.length
        ? []
        : repeatDays.map((day) => day.label),
    );
  };

  const selectedMantra =
    mantraTracks.find((track) => track.id === selectedMantraId) ?? mantraTracks[0];
  const selectedChantMantra =
    mantraTracks.find((track) => track.id === selectedChantMantraId) ??
    mantraTracks[0];
  const savedChantMantra =
    mantraTracks.find((track) => track.id === savedChantMantraId) ?? null;
  const selectedRingtone =
    ringtoneTracks.find((track) => track.id === selectedRingtoneId) ??
    ringtoneTracks[0];
  const savedRingtone =
    ringtoneTracks.find((track) => track.id === savedRingtoneId) ?? null;
  const selectedWallpaper =
    wallpaperOptions.find((wallpaper) => wallpaper.id === selectedWallpaperId) ??
    null;
  const lockWallpaper =
    wallpaperOptions.find((wallpaper) => wallpaper.id === lockWallpaperId) ??
    null;
  const homeWallpaper =
    wallpaperOptions.find((wallpaper) => wallpaper.id === homeWallpaperId) ??
    null;

  const handleSaveAlarm = () => {
    const nextAlarm: SavedAlarm = {
      id: editingAlarmId ?? `${Date.now()}`,
      hour,
      minute,
      period,
      repeatDays: selectedDays,
      enabled: true,
      mantraId: selectedMantra.id,
    };

    setSavedAlarms((current) => {
      if (editingAlarmId) {
        return current.map((alarm) =>
          alarm.id === editingAlarmId ? nextAlarm : alarm,
        );
      }

      return [nextAlarm, ...current].slice(0, 3);
    });
    setEditingAlarmId(null);
    window.history.pushState({ screen: "home" }, "", window.location.href);
    setScreen("home");
    toast.success("Alarm set successfully");
  };

  const handleDeleteAlarm = () => {
    if (!editingAlarmId) return;

    setSavedAlarms((current) =>
      current.filter((alarm) => alarm.id !== editingAlarmId),
    );
    setEditingAlarmId(null);
    window.history.pushState({ screen: "home" }, "", window.location.href);
    setScreen("home");
    toast.success("Alarm deleted");
  };

  const handleToggleAlarm = (alarmId: string, enabled: boolean) => {
    setSavedAlarms((current) =>
      current.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, enabled } : alarm,
      ),
    );
  };

  const handleSaveRingtone = () => {
    setSavedRingtoneId(selectedRingtoneId);
    window.history.pushState({ screen: "home" }, "", window.location.href);
    setScreen("home");
    setActiveHomeFeature("Ringtone");
    toast.success("Ringtone set successfully");
  };

  const handleSaveWallpaper = (placement: WallpaperPlacement) => {
    if (!selectedWallpaperId) return;
    const nextPlacement = wallpaperEditorTarget ?? placement;

    if (nextPlacement === "lock") {
      setLockWallpaperId(selectedWallpaperId);
    } else if (nextPlacement === "home") {
      setHomeWallpaperId(selectedWallpaperId);
    } else {
      setLockWallpaperId(selectedWallpaperId);
      setHomeWallpaperId(selectedWallpaperId);
    }

    window.history.pushState({ screen: "home" }, "", window.location.href);
    setScreen("home");
    setActiveHomeFeature("Wallpaper");
    toast.success("Wallpaper selected");
  };

  const handleStopMantraSession = () => {
    setSavedChantMantraId(selectedChantMantraId);
    setSavedChantCount(selectedChantCount);
    window.history.pushState({ screen: "home" }, "", window.location.href);
    setScreen("home");
    setActiveHomeFeature("Mantra");
  };

  return (
    <main className="h-dvh overflow-hidden bg-background text-foreground">
      {screen === "home" ? (
        <HomeScreen
          activeFeature={activeHomeFeature}
          alarms={savedAlarms}
          savedChantCount={savedChantCount}
          savedChantMantra={savedChantMantra}
          savedRingtone={savedRingtone}
          lockWallpaper={lockWallpaper}
          homeWallpaper={homeWallpaper}
          onChangeFeature={setActiveHomeFeature}
          onOpenAlarm={openExistingAlarm}
          onOpenChantingMantraScreen={openChantingMantraScreen}
          onOpenRingtoneScreen={openRingtoneScreen}
          onOpenWallpaperScreen={openWallpaperScreen}
          onOpenWallpaperScreenForTarget={openWallpaperScreenForTarget}
          onToggleAlarm={handleToggleAlarm}
          onSetAlarm={openAlarmScreen}
        />
      ) : screen === "alarm" ? (
        <AlarmScreen
          hour={hour}
          minute={minute}
          period={period}
          selectedDays={selectedDays}
          selectedMantra={selectedMantra}
          onBack={goBack}
          onOpenMantra={openMantraScreen}
          onHourChange={setHour}
          onMinuteChange={setMinute}
          onPeriodChange={setPeriod}
          onSetSelectedDays={setRepeatDays}
          onToggleEveryDay={toggleEveryDay}
          onSave={handleSaveAlarm}
          onDelete={handleDeleteAlarm}
          isEditing={Boolean(editingAlarmId)}
        />
      ) : (
        screen === "alarm-mantra" ? (
          <ChooseMantraScreen
            actionLabel="Select"
            activeFilter={selectedMantraFilter}
            selectedMantraId={selectedMantraId}
            tracks={mantraTracks}
            onBack={goBack}
            onChangeFilter={setSelectedMantraFilter}
            onConfirm={goBack}
            onSelectMantra={setSelectedMantraId}
          />
        ) : screen === "mantra-choose" ? (
          <ChooseMantraScreen
            actionLabel="Next"
            activeFilter={selectedMantraFilter}
            selectedMantraId={selectedChantMantraId}
            tracks={mantraTracks}
            onBack={goBack}
            onChangeFilter={setSelectedMantraFilter}
            onConfirm={openMantraCountScreen}
            onSelectMantra={setSelectedChantMantraId}
          />
        ) : screen === "mantra-count" ? (
          <MantraCountScreen
            count={selectedChantCount}
            mantraTitle={selectedChantMantra.title}
            onBack={goBack}
            onNext={openMantraSessionScreen}
            onSelectCount={setSelectedChantCount}
          />
        ) : screen === "mantra-session" ? (
          <MantraSessionScreen
            count={selectedChantCount}
            mantra={selectedChantMantra}
            onStop={handleStopMantraSession}
          />
        ) : screen === "ringtone" ? (
            <ChooseRingtoneScreen
              activeFilter={selectedRingtoneFilter}
              selectedRingtoneId={selectedRingtoneId}
              tracks={ringtoneTracks}
              onBack={goBack}
              onChangeFilter={setSelectedRingtoneFilter}
              onSave={handleSaveRingtone}
              onSelectRingtone={setSelectedRingtoneId}
            />
          ) : (
            <ChooseWallpaperScreen
              activeFilter={selectedWallpaperFilter}
              editorTarget={wallpaperEditorTarget}
              selectedWallpaperId={selectedWallpaperId}
              wallpapers={wallpaperOptions}
              onApply={handleSaveWallpaper}
              onBack={goBack}
              onChangeFilter={setSelectedWallpaperFilter}
              onSelectWallpaper={setSelectedWallpaperId}
            />
          )
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
      <Toaster position="bottom-center" />
    </main>
  );
}

function HomeScreen({
  activeFeature,
  alarms,
  savedChantCount,
  savedChantMantra,
  savedRingtone,
  lockWallpaper,
  homeWallpaper,
  onChangeFeature,
  onOpenAlarm,
  onOpenChantingMantraScreen,
  onOpenRingtoneScreen,
  onOpenWallpaperScreen,
  onOpenWallpaperScreenForTarget,
  onToggleAlarm,
  onSetAlarm,
}: {
  activeFeature: HomeFeature;
  alarms: SavedAlarm[];
  savedChantCount: MantraCountOption;
  savedChantMantra: MantraTrack | null;
  savedRingtone: RingtoneTrack | null;
  lockWallpaper: WallpaperOption | null;
  homeWallpaper: WallpaperOption | null;
  onChangeFeature: (feature: HomeFeature) => void;
  onOpenAlarm: (alarm: SavedAlarm) => void;
  onOpenChantingMantraScreen: () => void;
  onOpenRingtoneScreen: () => void;
  onOpenWallpaperScreen: () => void;
  onOpenWallpaperScreenForTarget: (target: WallpaperPlacement) => void;
  onToggleAlarm: (alarmId: string, enabled: boolean) => void;
  onSetAlarm: () => void;
}) {
  const isAlarmFeature = activeFeature === "Alarm";
  const isMantraFeature = activeFeature === "Mantra";
  const isRingtoneFeature = activeFeature === "Ringtone";
  const isWallpaperFeature = activeFeature === "Wallpaper";
  const ringtonePreview = usePreviewAudio(savedRingtone?.audioSrc);
  const hasAnyWallpaper = Boolean(lockWallpaper || homeWallpaper);
  const hasSharedWallpaper =
    Boolean(lockWallpaper && homeWallpaper) &&
    lockWallpaper?.id === homeWallpaper?.id;

  return (
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

      <section className="mt-6 grid grid-cols-2 gap-3">
        {featureTiles.map((tile) => {
          const Icon = tile.icon;

          return (
            <Button
              key={tile.label}
              variant="ghost"
              onClick={() => onChangeFeature(tile.label as HomeFeature)}
              className={cn(
                "h-14 justify-start rounded-xl border border-border bg-card px-3 text-sm font-medium shadow-none",
                activeFeature === tile.label
                  ? "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-card-foreground hover:bg-accent/70",
              )}
            >
              <Icon className="size-5" weight="regular" aria-hidden />
              <span>{tile.label}</span>
            </Button>
          );
        })}
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden pt-8">
        <div className="flex min-h-0 flex-1 items-start justify-center">
          <div className="w-full">
            {isAlarmFeature && alarms.length ? (
              <ScrollArea className="h-full pr-1">
                <div className="space-y-3">
                  {alarms.map((alarm) => (
                    <div
                      key={alarm.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenAlarm(alarm)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onOpenAlarm(alarm);
                        }
                      }}
                      className="w-full rounded-2xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <Card className="gap-0 rounded-2xl border-border bg-card py-0 shadow-none">
                        <CardContent className="space-y-4 px-4 py-4">
                          <div className="flex items-center justify-between gap-4">
                            <CardTitle className="text-3xl font-medium tracking-tight">
                              {alarm.hour}:{alarm.minute} {alarm.period}
                            </CardTitle>
                            <div
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              <Switch
                                size="lg"
                                checked={alarm.enabled}
                                onCheckedChange={(checked) => {
                                  onToggleAlarm(alarm.id, checked);
                                }}
                                aria-label={alarm.enabled ? "Disable alarm" : "Enable alarm"}
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {repeatDays.map((day) => {
                              const selected = alarm.repeatDays.includes(day.label);

                              return (
                                <span
                                  key={day.label}
                                  className={cn(
                                    "flex size-8 items-center justify-center rounded-full text-xs font-medium",
                                    selected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-muted-foreground",
                                  )}
                                >
                                  {day.shortLabel}
                                </span>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : isMantraFeature && savedChantMantra ? (
              <div className="space-y-4 pt-3">
                <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
                  <CardContent className="space-y-3 px-4 py-4">
                    <p className="text-xs font-medium leading-5 text-muted-foreground">
                      Mantra
                    </p>
                    <div className="flex w-full items-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        className="shrink-0 rounded-full"
                        onClick={onOpenChantingMantraScreen}
                        aria-label="Start mantra session"
                      >
                        <Play className="size-4" weight="fill" aria-hidden />
                      </Button>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-medium leading-6 tracking-tight text-foreground">
                          {savedChantMantra.title}
                        </p>
                        <p className="text-sm leading-5 text-muted-foreground">
                          {savedChantCount === "infinite"
                            ? "Infinite chant"
                            : `${savedChantCount} chants`}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 rounded-lg px-2.5 text-primary"
                        onClick={onOpenChantingMantraScreen}
                      >
                        Change
                        <CaretRight className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : isRingtoneFeature && savedRingtone ? (
              <div className="space-y-4 pt-3">
                <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
                  <CardContent className="space-y-3 px-4 py-4">
                    <p className="text-xs font-medium leading-5 text-muted-foreground">
                      Ringtone
                    </p>
                    <div className="flex w-full items-center gap-3">
                      <span
                        className="shrink-0"
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon-sm"
                          className={cn(
                            "rounded-full",
                            ringtonePreview.isPlaying && "text-primary",
                          )}
                          onClick={() => {
                            void ringtonePreview.toggle();
                          }}
                          aria-label={
                            ringtonePreview.isPlaying
                              ? "Pause ringtone preview"
                              : "Play ringtone preview"
                          }
                        >
                          {ringtonePreview.isPlaying ? (
                            <Pause className="size-4" weight="fill" aria-hidden />
                          ) : (
                            <Play className="size-4" weight="fill" aria-hidden />
                          )}
                        </Button>
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-medium leading-6 tracking-tight text-foreground">
                          {savedRingtone.title}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 rounded-lg px-2.5 text-primary"
                        onClick={onOpenRingtoneScreen}
                      >
                        Change
                        <CaretRight className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : isWallpaperFeature && hasAnyWallpaper ? (
              <div className="space-y-4 pt-3">
                {hasSharedWallpaper && lockWallpaper ? (
                  <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
                    <CardContent className="space-y-3 px-4 py-4">
                      <p className="text-xs font-medium leading-5 text-muted-foreground">
                        Wallpaper
                      </p>

                      <div className="flex items-center gap-3">
                        <div
                          className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary"
                          aria-hidden
                        >
                          <img
                            src={lockWallpaper.imageSrc}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-medium leading-6 tracking-tight text-foreground">
                            {lockWallpaper.title}
                          </p>
                          <p className="text-sm leading-5 text-muted-foreground">
                            Home &amp; Lock Screen
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0 rounded-lg px-2.5 text-primary"
                          onClick={onOpenWallpaperScreen}
                        >
                          Change
                          <CaretRight className="size-4" aria-hidden />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {lockWallpaper ? (
                      <WallpaperSummaryCard
                        label="Lock Screen"
                        wallpaper={lockWallpaper}
                        onChange={() => onOpenWallpaperScreenForTarget("lock")}
                      />
                    ) : (
                      <WallpaperEmptySlotCard
                        label="Lock Screen"
                        actionLabel="Add Lock Screen"
                        onAction={() => onOpenWallpaperScreenForTarget("lock")}
                      />
                    )}
                    {homeWallpaper ? (
                      <WallpaperSummaryCard
                        label="Home Screen"
                        wallpaper={homeWallpaper}
                        onChange={() => onOpenWallpaperScreenForTarget("home")}
                      />
                    ) : (
                      <WallpaperEmptySlotCard
                        label="Home Screen"
                        actionLabel="Add Home Screen"
                        onAction={() => onOpenWallpaperScreenForTarget("home")}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center pt-3">
                <div className="mx-auto flex aspect-square w-full max-w-[min(150px,21dvh)] items-center justify-center rounded-2xl border border-border bg-secondary text-muted-foreground">
                  {isRingtoneFeature ? (
                    <MusicNotes
                      className="size-9 opacity-70"
                      weight="regular"
                      aria-hidden
                    />
                  ) : isMantraFeature ? (
                    <Quotes
                      className="size-9 opacity-70"
                      weight="regular"
                      aria-hidden
                    />
                  ) : isWallpaperFeature ? (
                    <ImageSquare
                      className="size-9 opacity-70"
                      weight="regular"
                      aria-hidden
                    />
                  ) : (
                    <ImageSquare
                      className="size-9 opacity-70"
                      weight="regular"
                      aria-hidden
                    />
                  )}
                </div>

                <div className="mt-6 space-y-2 text-center">
                  <h2 className="text-xl font-medium leading-7 tracking-tight">
                    {isRingtoneFeature
                      ? "Daily Ringtone"
                      : isMantraFeature
                        ? "Daily Mantra"
                      : isWallpaperFeature
                        ? "Daily Wallpaper"
                        : "Daily Alarm"}
                  </h2>
                  <p className="mx-auto max-w-[240px] text-sm leading-5 text-muted-foreground">
                    {isRingtoneFeature
                      ? "Choose a ringtone that plays with your alarm every morning."
                      : isMantraFeature
                        ? "Start your day with a mantra that feels calm, grounding, and familiar."
                      : isWallpaperFeature
                        ? "Pick one wallpaper and apply it to your home screen, lock screen, or both."
                      : "Set daily mantra and start your day with peace."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pb-1">
          {!(isMantraFeature && savedChantMantra) &&
          !(isRingtoneFeature && savedRingtone) &&
          !(isWallpaperFeature && hasAnyWallpaper) ? (
            <Button
              size="lg"
              className="h-12 rounded-full px-5 text-sm shadow-sm"
              onClick={
                isAlarmFeature
                  ? onSetAlarm
                  : isRingtoneFeature
                    ? onOpenRingtoneScreen
                    : isWallpaperFeature
                      ? onOpenWallpaperScreen
                    : isMantraFeature
                      ? onOpenChantingMantraScreen
                    : undefined
              }
            >
              <Plus className="size-4" weight="bold" aria-hidden />
              {isRingtoneFeature
                ? "Set Ringtone"
                : isMantraFeature
                  ? "Start Chanting Mantra"
                : isWallpaperFeature
                  ? "Set Wallpaper"
                  : "Create Alarm"}
            </Button>
          ) : null}
        </div>
      </section>
    </section>
  );
}

function AlarmScreen({
  hour,
  minute,
  period,
  selectedDays,
  selectedMantra,
  onBack,
  onOpenMantra,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onSetSelectedDays,
  onToggleEveryDay,
  onSave,
  onDelete,
  isEditing,
}: {
  hour: string;
  minute: string;
  period: string;
  selectedDays: string[];
  selectedMantra: MantraTrack;
  onBack: () => void;
  onOpenMantra: () => void;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onSetSelectedDays: (value: string[]) => void;
  onToggleEveryDay: () => void;
  onSave: () => void;
  onDelete: () => void;
  isEditing: boolean;
}) {
  const allDaysSelected = selectedDays.length === repeatDays.length;
  const mantraPreview = usePreviewAudio(selectedMantra.audioSrc);

  return (
    <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-4 md:hidden">
      <header className="grid h-10 grid-cols-[2.25rem_1fr_2.25rem] items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 justify-self-start rounded-md"
          onClick={onBack}
        >
          <CaretLeft className="size-6" weight="regular" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-center text-lg font-medium leading-6 tracking-tight">
          Set Alarm
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 pt-5">
        <section>
          <p className="mb-3 text-sm font-medium leading-5">Time</p>
          <div className="relative grid grid-cols-[1fr_1fr_0.78fr] overflow-hidden rounded-xl bg-secondary p-2 text-center">
            <div className="pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-md bg-card" />
            <WheelPicker
              values={hourValues}
              value={hour}
              onChange={onHourChange}
            />
            <WheelPicker
              values={minuteValues}
              value={minute}
              onChange={onMinuteChange}
            />
            <WheelPicker
              values={periodValues}
              value={period}
              onChange={onPeriodChange}
              loop={false}
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium leading-5">Repeat</p>
            </div>
            <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={allDaysSelected}
                onCheckedChange={onToggleEveryDay}
              />
              Every day
            </label>
          </div>

          <ToggleGroup
            type="multiple"
            value={selectedDays}
            onValueChange={onSetSelectedDays}
            className="grid w-full grid-cols-7 rounded-xl bg-secondary p-1"
          >
            {repeatDays.map((day) => (
              <ToggleGroupItem
                key={day.label}
                value={day.label}
                variant="default"
                size="sm"
                aria-label={day.label}
                className={cn(
                  "h-9 min-w-0 rounded-lg px-0 text-sm font-medium shadow-none transition-colors hover:bg-background/70 hover:text-foreground",
                  "text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground",
                  allDaysSelected &&
                    "data-[state=on]:bg-card data-[state=on]:text-foreground",
                )}
              >
                {day.shortLabel}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>

        <section className="rounded-xl bg-card px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-sm font-medium leading-5">
                Mantra
              </span>
              <span className="mt-0.5 block truncate text-sm leading-5 text-muted-foreground">
                {selectedMantra.title}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="rounded-full"
                onClick={mantraPreview.toggle}
                aria-label={mantraPreview.isPlaying ? "Pause mantra preview" : "Play mantra preview"}
              >
                {mantraPreview.isPlaying ? (
                  <Pause className="size-4" weight="fill" aria-hidden />
                ) : (
                  <Play className="size-4" weight="fill" aria-hidden />
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-lg px-2.5 text-primary"
                onClick={onOpenMantra}
              >
                Change
                <CaretRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-2">
        <Button
          size="lg"
          className="h-11 w-full rounded-xl text-sm shadow-none"
          onClick={onSave}
        >
          Save
        </Button>
        {isEditing ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full rounded-xl px-0 text-sm text-destructive hover:bg-transparent hover:text-destructive/90"
            onClick={onDelete}
          >
            Delete alarm
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function ChooseMantraScreen({
  actionLabel,
  activeFilter,
  selectedMantraId,
  tracks,
  onBack,
  onChangeFilter,
  onConfirm,
  onSelectMantra,
}: {
  actionLabel: string;
  activeFilter: string;
  selectedMantraId: string;
  tracks: MantraTrack[];
  onBack: () => void;
  onChangeFilter: (value: string) => void;
  onConfirm: () => void;
  onSelectMantra: (value: string) => void;
}) {
  const filteredTracks =
    activeFilter === "All"
      ? tracks
      : tracks.filter((track) => track.deity === activeFilter);
  const selectedTrack =
    tracks.find((track) => track.id === selectedMantraId) ?? tracks[0];
  const selectedPreview = usePreviewAudio(selectedTrack.audioSrc);
  const hasMountedRef = useRef(false);
  const allowAutoplayRef = useRef(true);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!allowAutoplayRef.current) {
      return;
    }

    void selectedPreview.play();
  }, [selectedTrack.id]);

  useEffect(() => {
    return () => {
      selectedPreview.stop();
    };
  }, []);

  return (
    <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-4 md:hidden">
      <header className="grid h-10 grid-cols-[2.25rem_1fr_2.25rem] items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 justify-self-start rounded-md"
          onClick={onBack}
        >
          <CaretLeft className="size-6" weight="regular" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-center text-lg font-medium leading-6 tracking-tight">
          Choose Mantra
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 pt-5">
        <section className="space-y-3">
          <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
              {mantraFilters.map((filter) => (
                <Button
                  key={filter}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChangeFilter(filter)}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs font-medium shadow-none",
                    activeFilter === filter
                      ? "bg-secondary text-foreground hover:bg-secondary"
                      : "bg-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <ScrollArea className="min-h-0 flex-1">
          <div className="divide-y divide-border/80">
            {filteredTracks.map((track) => (
              <MantraTrackRow
                key={track.id}
                track={track}
                selected={track.id === selectedMantraId}
                onSelect={onSelectMantra}
                isPreviewPlaying={
                  track.id === selectedMantraId && selectedPreview.isPlaying
                }
                onTogglePreview={
                  track.id === selectedMantraId
                    ? async () => {
                        if (selectedPreview.isPlaying) {
                          allowAutoplayRef.current = false;
                        } else {
                          allowAutoplayRef.current = true;
                        }

                        await selectedPreview.toggle();
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <Button
        size="lg"
        className="mt-4 h-11 w-full rounded-xl text-sm shadow-none"
        onClick={onConfirm}
      >
        {actionLabel}
      </Button>
    </section>
  );
}

function MantraCountScreen({
  count,
  mantraTitle,
  onBack,
  onNext,
  onSelectCount,
}: {
  count: MantraCountOption;
  mantraTitle: string;
  onBack: () => void;
  onNext: () => void;
  onSelectCount: (value: MantraCountOption) => void;
}) {
  return (
    <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-4 md:hidden">
      <header className="grid h-10 grid-cols-[2.25rem_1fr_2.25rem] items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 justify-self-start rounded-md"
          onClick={onBack}
        >
          <CaretLeft className="size-6" weight="regular" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-center text-lg font-medium leading-6 tracking-tight">
          Mantra Count
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 pt-5">
        <section className="space-y-1">
          <p className="text-sm font-medium leading-5">Selected mantra</p>
          <p className="text-sm leading-5 text-muted-foreground">
            {mantraTitle}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {mantraCountOptions.map((option) => {
            const selected = option.value === count;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelectCount(option.value)}
                className={cn(
                  "rounded-2xl border px-4 py-4 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-accent/40",
                )}
              >
                <p className="text-lg font-medium leading-6 tracking-tight text-foreground">
                  {option.label}
                </p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </section>
      </div>

      <Button
        size="lg"
        className="h-11 w-full rounded-xl text-sm shadow-none"
        onClick={onNext}
      >
        Next
      </Button>
    </section>
  );
}

function MantraSessionScreen({
  count,
  mantra,
  onStop,
}: {
  count: MantraCountOption;
  mantra: MantraTrack;
  onStop: () => void;
}) {
  const [currentLoop, setCurrentLoop] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInfinite = count === "infinite";
  const totalLoops = isInfinite ? null : Number.parseInt(count, 10);

  useEffect(() => {
    setCurrentLoop(1);
    const audio = new Audio(mantra.audioSrc);
    audio.preload = "auto";
    audioRef.current = audio;
    let cancelled = false;

    const startPlayback = async () => {
      try {
        audio.currentTime = 0;
        await audio.play();
        if (!cancelled) {
          setIsPlaying(true);
        }
      } catch {
        if (!cancelled) {
          setIsPlaying(false);
        }
      }
    };

    const handleEnded = () => {
      if (cancelled) return;

      setCurrentLoop((prev) => {
        const next = prev + 1;

        if (totalLoops !== null && next > totalLoops) {
          setIsPlaying(false);
          return prev;
        }

        void startPlayback();
        return next;
      });
    };

    audio.addEventListener("ended", handleEnded);
    void startPlayback();

    return () => {
      cancelled = true;
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [mantra.audioSrc, totalLoops]);

  const progress = totalLoops ? Math.min(currentLoop / totalLoops, 1) : 0;

  return (
    <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-secondary px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] md:hidden">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <div className="flex size-28 items-center justify-center rounded-full bg-card text-primary">
          <Quotes className="size-10" weight="regular" aria-hidden />
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-sm font-medium leading-5 text-muted-foreground">
            Chanting mantra
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            {mantra.title}
          </h1>
        </div>

        <div className="mt-8 w-full max-w-xs rounded-2xl bg-card px-5 py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm leading-5 text-muted-foreground">
                Current
              </p>
              <p className="text-2xl font-medium tracking-tight text-foreground">
                {isInfinite ? "∞" : currentLoop}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm leading-5 text-muted-foreground">
                Total
              </p>
              <p className="text-2xl font-medium tracking-tight text-foreground">
                {isInfinite ? "∞" : totalLoops}
              </p>
            </div>
          </div>

          {isInfinite ? (
            <p className="mt-4 text-sm leading-5 text-muted-foreground">
              Playing until you stop.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-sm leading-5 text-muted-foreground">
                {currentLoop} of {totalLoops} chants completed
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "size-2.5 rounded-full",
              isPlaying ? "bg-primary" : "bg-muted-foreground/30",
            )}
            aria-hidden
          />
          {isPlaying ? "Playing" : "Stopped"}
        </div>
      </div>

      <Button
        size="lg"
        variant="secondary"
        className="h-12 w-full rounded-full text-sm shadow-none"
        onClick={() => {
          audioRef.current?.pause();
          audioRef.current && (audioRef.current.currentTime = 0);
          setIsPlaying(false);
          onStop();
        }}
      >
        Stop Mantra
      </Button>
    </section>
  );
}

function ChooseRingtoneScreen({
  activeFilter,
  selectedRingtoneId,
  tracks,
  onBack,
  onChangeFilter,
  onSave,
  onSelectRingtone,
}: {
  activeFilter: string;
  selectedRingtoneId: string;
  tracks: RingtoneTrack[];
  onBack: () => void;
  onChangeFilter: (value: string) => void;
  onSave: () => void;
  onSelectRingtone: (value: string) => void;
}) {
  const filteredTracks =
    activeFilter === "All"
      ? tracks
      : tracks.filter((track) => track.category === activeFilter);
  const selectedTrack =
    tracks.find((track) => track.id === selectedRingtoneId) ?? tracks[0];
  const selectedPreview = usePreviewAudio(selectedTrack.audioSrc);
  const hasMountedRef = useRef(false);
  const allowAutoplayRef = useRef(true);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!allowAutoplayRef.current) {
      return;
    }

    void selectedPreview.play();
  }, [selectedTrack.id]);

  useEffect(() => {
    return () => {
      selectedPreview.stop();
    };
  }, []);

  return (
    <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-4 md:hidden">
      <header className="grid h-10 grid-cols-[2.25rem_1fr_2.25rem] items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 justify-self-start rounded-md"
          onClick={onBack}
        >
          <CaretLeft className="size-6" weight="regular" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-center text-lg font-medium leading-6 tracking-tight">
          Choose Ringtone
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 pt-5">
        <section className="space-y-3">
          <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
              {ringtoneFilters.map((filter) => (
                <Button
                  key={filter}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChangeFilter(filter)}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs font-medium shadow-none",
                    activeFilter === filter
                      ? "bg-secondary text-foreground hover:bg-secondary"
                      : "bg-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <ScrollArea className="min-h-0 flex-1">
          <div className="divide-y divide-border/80">
            {filteredTracks.map((track) => (
              <RingtoneTrackRow
                key={track.id}
                track={track}
                selected={track.id === selectedRingtoneId}
                onSelect={onSelectRingtone}
                isPreviewPlaying={
                  track.id === selectedRingtoneId && selectedPreview.isPlaying
                }
                onTogglePreview={
                  track.id === selectedRingtoneId
                    ? async () => {
                        if (selectedPreview.isPlaying) {
                          allowAutoplayRef.current = false;
                        } else {
                          allowAutoplayRef.current = true;
                        }

                        await selectedPreview.toggle();
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <Button
        size="lg"
        className="mt-4 h-11 w-full rounded-xl text-sm shadow-none"
        onClick={onSave}
      >
        Set Ringtone
      </Button>
    </section>
  );
}

function ChooseWallpaperScreen({
  activeFilter,
  editorTarget,
  selectedWallpaperId,
  wallpapers,
  onApply,
  onBack,
  onChangeFilter,
  onSelectWallpaper,
}: {
  activeFilter: string;
  editorTarget: WallpaperPlacement | null;
  selectedWallpaperId: string | null;
  wallpapers: WallpaperOption[];
  onApply: (placement: WallpaperPlacement) => void;
  onBack: () => void;
  onChangeFilter: (value: string) => void;
  onSelectWallpaper: (value: string | null) => void;
}) {
  const [placementSheetOpen, setPlacementSheetOpen] = useState(false);
  const filteredWallpapers =
    activeFilter === "All"
      ? wallpapers
      : wallpapers.filter((wallpaper) => wallpaper.category === activeFilter);
  const hasSelection = selectedWallpaperId !== null;
  const placementOptions =
    editorTarget === "lock"
      ? [
          { value: "lock", label: "Lock Screen", icon: Lock },
          { value: "both", label: "Set as Both", icon: Copy },
        ]
      : editorTarget === "home"
        ? [
            { value: "home", label: "Home Screen", icon: House },
            { value: "both", label: "Set as Both", icon: Copy },
          ]
        : [
            { value: "lock", label: "Lock Screen", icon: Lock },
            { value: "home", label: "Home Screen", icon: House },
            { value: "both", label: "Set as Both", icon: Copy },
          ];

  return (
    <>
      <section className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-4 md:hidden">
        <header className="grid h-10 grid-cols-[2.25rem_1fr_2.25rem] items-center">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 justify-self-start rounded-md"
            onClick={onBack}
          >
            <CaretLeft className="size-6" weight="regular" aria-hidden />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-center text-lg font-medium leading-6 tracking-tight">
            Choose Wallpaper
          </h1>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 pt-5">
          <section className="space-y-3">
            <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-2">
                {wallpaperFilters.map((filter) => (
                  <Button
                    key={filter}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChangeFilter(filter)}
                    className={cn(
                      "h-8 rounded-full px-3 text-xs font-medium shadow-none",
                      activeFilter === filter
                        ? "bg-secondary text-foreground hover:bg-secondary"
                        : "bg-transparent text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                    )}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <div className="-mx-5 flex min-h-0 flex-1 overflow-x-auto px-5 pb-2 [scrollbar-width:none] snap-x snap-mandatory [scroll-padding-inline:1.25rem] [&::-webkit-scrollbar]:hidden">
            {filteredWallpapers.map((wallpaper) => {
              const selected = wallpaper.id === selectedWallpaperId;

              return (
                <button
                  key={wallpaper.id}
                  type="button"
                  onClick={() => onSelectWallpaper(wallpaper.id)}
                  className={cn(
                    "relative mr-3 aspect-[9/16] w-[calc(100vw-3.25rem)] max-w-[320px] shrink-0 snap-center snap-always overflow-hidden rounded-[1.75rem] border text-left outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 last:mr-0",
                    selected
                      ? "border-primary ring-2 ring-primary/25"
                      : "border-border bg-secondary opacity-85",
                  )}
                >
                  <img
                    src={wallpaper.imageSrc}
                    alt={wallpaper.title}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  <span
                    className={cn(
                      "absolute inset-0 rounded-[1.75rem] transition-colors",
                      selected
                        ? "bg-transparent"
                        : "bg-background/8",
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border bg-background/92 text-transparent shadow-sm backdrop-blur transition-colors",
                      selected &&
                        "border-primary bg-primary text-primary-foreground",
                    )}
                    aria-hidden
                  >
                    <Check className="size-4" weight="bold" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          size="lg"
          className="mt-4 h-11 w-full rounded-xl text-sm shadow-none"
          disabled={!hasSelection}
          onClick={() => setPlacementSheetOpen(true)}
        >
          Apply Wallpaper
        </Button>
      </section>

      <Drawer open={placementSheetOpen} onOpenChange={setPlacementSheetOpen}>
        <DrawerContent className="rounded-t-3xl border-border bg-background px-1 [&>div:first-child]:mt-3 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-border">
          <DrawerHeader className="px-4 pb-4 pt-5 text-left">
            <DrawerTitle className="text-base font-medium">
              Set wallpaper
            </DrawerTitle>
          </DrawerHeader>

          <div
            className={cn(
              "gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
              placementOptions.length === 2 ? "grid grid-cols-2" : "grid grid-cols-3",
            )}
          >
            {placementOptions.map((option) => {
              const Icon = option.icon;

              return (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setPlacementSheetOpen(false);
                      onApply(option.value as WallpaperPlacement);
                  }}
                  className="flex min-h-24 flex-col items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-2 py-4 text-center outline-none transition-colors hover:bg-accent/30 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <Icon className="size-5" weight="regular" aria-hidden />
                  </span>
                  <span className="text-sm font-medium leading-5 text-foreground">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function WallpaperSummaryCard({
  label,
  wallpaper,
  onChange,
}: {
  label: string;
  wallpaper: WallpaperOption;
  onChange: () => void;
}) {
  return (
    <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
      <CardContent className="space-y-3 px-4 py-4">
        <p className="text-xs font-medium leading-5 text-muted-foreground">
          {label}
        </p>

        <div className="flex items-center gap-3">
          <div
            className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary"
            aria-hidden
          >
            <img
              src={wallpaper.imageSrc}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium leading-6 tracking-tight text-foreground">
              {wallpaper.title}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 rounded-lg px-2.5 text-primary"
            onClick={onChange}
          >
            Change
            <CaretRight className="size-4" aria-hidden />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WallpaperEmptySlotCard({
  label,
  actionLabel,
  onAction,
}: {
  label: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
      <CardContent className="space-y-3 px-4 py-4">
        <p className="text-xs font-medium leading-5 text-muted-foreground">
          {label}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-medium leading-6 tracking-tight text-foreground">
              No wallpaper set
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 rounded-lg px-2.5 text-primary"
            onClick={onAction}
          >
            {actionLabel}
            <CaretRight className="size-4" aria-hidden />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MantraTrackRow({
  track,
  selected,
  onSelect,
  isPreviewPlaying = false,
  onTogglePreview,
}: {
  track: MantraTrack;
  selected: boolean;
  onSelect: (value: string) => void;
  isPreviewPlaying?: boolean;
  onTogglePreview?: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(track.id)}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 py-3 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        selected ? "text-foreground" : "text-foreground hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-transparent",
        )}
        aria-hidden
      >
        <Check className="size-3.5" weight="bold" />
      </span>

      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium leading-5 text-foreground">
          {track.title}
        </span>
      </div>

      {selected ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full bg-secondary text-foreground hover:bg-muted"
          onClick={(event) => {
            event.stopPropagation();
            void onTogglePreview?.();
          }}
          aria-label={isPreviewPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        >
          {isPreviewPlaying ? (
            <Pause className="size-4" weight="fill" aria-hidden />
          ) : (
            <Play className="size-4" weight="fill" aria-hidden />
          )}
        </Button>
      ) : null}
    </button>
  );
}

function RingtoneTrackRow({
  track,
  selected,
  onSelect,
  isPreviewPlaying = false,
  onTogglePreview,
}: {
  track: RingtoneTrack;
  selected: boolean;
  onSelect: (value: string) => void;
  isPreviewPlaying?: boolean;
  onTogglePreview?: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(track.id)}
      className="flex min-h-14 w-full items-center gap-3 py-3 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-transparent",
        )}
        aria-hidden
      >
        <Check className="size-3.5" weight="bold" />
      </span>

      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium leading-5 text-foreground">
          {track.title}
        </span>
      </div>

      {selected ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full bg-secondary text-foreground hover:bg-muted"
          onClick={(event) => {
            event.stopPropagation();
            void onTogglePreview?.();
          }}
          aria-label={
            isPreviewPlaying ? `Pause ${track.title}` : `Play ${track.title}`
          }
        >
          {isPreviewPlaying ? (
            <Pause className="size-4" weight="fill" aria-hidden />
          ) : (
            <Play className="size-4" weight="fill" aria-hidden />
          )}
        </Button>
      ) : null}
    </button>
  );
}

function WheelPicker({
  values,
  value,
  onChange,
  loop = true,
}: {
  values: string[];
  value: string;
  onChange: (value: string) => void;
  loop?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasPositionedRef = useRef(false);
  const [selectedRenderedIndex, setSelectedRenderedIndex] = useState(0);
  const renderedValues = loop
    ? Array.from(
        { length: values.length * wheelCycleCount },
        (_, index) => values[index % values.length],
      )
    : values;

  useEffect(() => {
    if (hasPositionedRef.current) {
      return;
    }

    const selectedIndex = Math.max(values.indexOf(value), 0);
    const centeredIndex = loop
      ? wheelCenterCycle * values.length + selectedIndex
      : selectedIndex;

    scrollRef.current?.scrollTo({
      top: centeredIndex * wheelItemHeight,
      behavior: "auto",
    });
    setSelectedRenderedIndex(centeredIndex);
    hasPositionedRef.current = true;
  }, [loop, value, values]);

  const handleScroll = () => {
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    const rawIndex = Math.round(scrollTop / wheelItemHeight);
    const normalizedIndex = loop
      ? ((rawIndex % values.length) + values.length) % values.length
      : Math.min(Math.max(rawIndex, 0), values.length - 1);
    const nextValue = values[normalizedIndex];
    const shouldRecenter =
      loop &&
      (rawIndex < values.length * 2 ||
        rawIndex > values.length * (wheelCycleCount - 2));
    const nextRenderedIndex = shouldRecenter
      ? wheelCenterCycle * values.length + normalizedIndex
      : rawIndex;

    if (shouldRecenter) {
      window.requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: nextRenderedIndex * wheelItemHeight,
          behavior: "auto",
        });
      });
    }

    setSelectedRenderedIndex(nextRenderedIndex);

    if (nextValue !== value) {
      onChange(nextValue);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="relative z-10 h-28 snap-y snap-mandatory overflow-y-auto py-9 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onScroll={handleScroll}
    >
      {renderedValues.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={cn(
            "flex h-10 snap-center items-center justify-center text-lg font-medium tabular-nums transition-colors",
            index === selectedRenderedIndex
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
