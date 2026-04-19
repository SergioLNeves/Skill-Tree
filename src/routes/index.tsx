import Hero from "#/components/templates/home/hero/hero";
import Install from "#/components/templates/home/install/install";
import Metrics from "#/components/templates/home/metrics/metrics";
import TodayPick from "#/components/templates/home/today-pick/today-pick";
import { metricsMock, todayPickMock } from "#/types/metrics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col container justify-center items-center min-w-screen max-w-md px-4 py-10">
      <div className="flex flex-col max-w-8xl gap-16 ">
        <Hero />
        <Install />
        <Metrics {...metricsMock} />
        <TodayPick items={todayPickMock} />
      </div>
    </div>
  );
}
