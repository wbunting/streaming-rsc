"use server";

import streamReact from "@/lib/streamable-ui/stream-react";

const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return "82°F️ ☀️";
};

interface WeatherProps {
  location: string;
  weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);

export async function streamComponent() {
  const result = await streamReact(async function* () {
    yield <LoadingComponent />;
    const weather = await getWeather("San Francisco");
    return <WeatherComponent weather={weather} location="San Francisco" />;
  });

  // @ts-expect-error (because thigns)
  return result.value;
}
