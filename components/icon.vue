<script setup>
import {
  Home,
  Hand,
  BarChart3,
  BookOpen,
  User,
  Check,
  Play,
  Square,
  RotateCcw,
  Plus,
  Image,
  Calendar,
  TrendingUp,
  Baby,
  Smile,
  Meh,
  Frown,
  Heart,
  Timer,
  Camera,
  Info,
  Bell,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Clock,
  Pointer,
  Droplet,
  Calculator
} from 'lucide-vue-next'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: Number,
    default: 2
  }
})

const iconMap = {
  home: Home,
  hand: Hand,
  chart: BarChart3,
  book: BookOpen,
  user: User,
  check: Check,
  play: Play,
  stop: Square,
  refresh: RotateCcw,
  plus: Plus,
  image: Image,
  calendar: Calendar,
  trending: TrendingUp,
  baby: Baby,
  smile: Smile,
  meh: Meh,
  frown: Frown,
  heart: Heart,
  timer: Timer,
  camera: Camera,
  info: Info,
  bell: Bell,
  sunrise: Sunrise,
  sun: Sun,
  'cloud-sun': CloudSun,
  sunset: Sunset,
  moon: Moon,
  clock: Clock,
  pointer: Pointer,
  droplet: Droplet,
  calculator: Calculator
}
</script>

<template>
  <component
    :is="iconMap[name]"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
  />
</template>