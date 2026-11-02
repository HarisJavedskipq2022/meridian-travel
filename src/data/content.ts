import { photos } from "@/lib/images";
import type { SearchType } from "@/lib/search/types";

export type Service = {
  type: SearchType;
  title: string;
  summary: string;
  points: string[];
  image: string;
  cta: string;
};

export const services: Service[] = [
  {
    type: "visa",
    title: "Visa services",
    summary: "Find out what your passport needs, then let us prepare and file the application.",
    points: [
      "Document checklist for your passport",
      "Appointment booking and form filling",
      "Status updates by WhatsApp",
    ],
    image: photos.documents,
    cta: "Check visa requirements",
  },
  {
    type: "flights",
    title: "Flight tickets",
    summary: "Compare fares across carriers, with baggage and layovers shown up front.",
    points: ["One-way and return fares", "Free date changes on flexible fares"],
    image: photos.planeWing,
    cta: "Search flights",
  },
  {
    type: "hotels",
    title: "Hotel booking",
    summary: "Hand-checked stays, from city apartments to overwater villas.",
    points: ["Free cancellation on most rooms", "Pay at the property options"],
    image: photos.resortPalms,
    cta: "Find a hotel",
  },
  {
    type: "cars",
    title: "Car rental",
    summary: "Pick up at the airport and drive off. Insurance included in every quote.",
    points: ["Unlimited mileage", "Child seats on request"],
    image: photos.driving,
    cta: "Rent a car",
  },
];

export const stats = [
  { value: 48200, suffix: "", label: "Travellers booked since 2014" },
  { value: 98.4, suffix: "%", decimals: 1, label: "Visa applications approved" },
  { value: 140, suffix: "", label: "Countries we file visas for" },
  { value: 12000, suffix: "+", label: "Partner hotels worldwide" },
];

export const steps = [
  {
    title: "Tell us the trip",
    body: "Search a route or send us dates and a budget. A planner replies within two working hours.",
  },
  {
    title: "We handle the paperwork",
    body: "Visa forms, appointment slots, insurance and bookings, checked against embassy requirements.",
  },
  {
    title: "Fly with everything in one place",
    body: "Tickets, vouchers and your visa land in a single itinerary, with a planner on call while you travel.",
  },
];

export type Testimonial = {
  name: string;
  trip: string;
  quote: string;
  avatar: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ayesha Siddiqui",
    trip: "Schengen visa and two weeks in Portugal",
    quote:
      "I had been refused once before applying on my own. Meridian rebuilt my file, booked the appointment and the visa came back in eleven days.",
    avatar: "1494790108377-be9c29b29330",
    rating: 5,
  },
  {
    name: "Omar Farooq",
    trip: "Family trip to Dubai, five travellers",
    quote:
      "Flights, a two-bedroom apartment and a seven-seater car, all on one invoice. The car was waiting at arrivals.",
    avatar: "1507003211169-0a1dd7228f2d",
    rating: 5,
  },
  {
    name: "Sara Malik",
    trip: "Honeymoon in the Maldives and Bali",
    quote:
      "Our planner found a villa upgrade for the same price and moved our flight when the airline changed the schedule. We never had to call anyone.",
    avatar: "1438761681033-6461ffad8d80",
    rating: 5,
  },
  {
    name: "Daniyal Ahmed",
    trip: "UK business visa, Lahore to London",
    quote:
      "Clear checklist, honest timelines and no surprise fees. I had my decision before the conference registration closed.",
    avatar: "1500648767791-00dcc994a43e",
    rating: 4,
  },
  {
    name: "Hina Qureshi",
    trip: "Tokyo and Kyoto, 10 days",
    quote:
      "They sorted my Japan visa, rail passes and a ryokan I would never have found myself. Worth every rupee of the service fee.",
    avatar: "1544005313-94ddf0286df2",
    rating: 5,
  },
];

export const contact = {
  phone: "+92 21 3456 7890",
  whatsapp: "+92 300 123 4567",
  email: "hello@meridian.travel",
  address: "Office 1204, Ocean Tower, Clifton Block 9, Karachi",
  hours: "Mon – Sat, 9:00 to 19:00 PKT",
};
