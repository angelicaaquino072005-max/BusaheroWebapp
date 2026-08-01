import BusIllustration from "@/components/BusIllustration";
import GoalCard from "@/components/GoalCard";
import { IconUsers, IconFlag, IconClock, IconBus, IconBulb } from "@/components/Icons";

export default function MissionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h2 className="mb-4 border-b-2 border-brand pb-2 text-xl font-bold text-slate-800">
        Mission
      </h2>

      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2 md:items-center">
        <div>
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-brand">
            <IconFlag size={22} />
          </span>
          <h3 className="mb-2 text-base font-semibold text-brand">Our Mission</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Our mission is to develop a reliable and user-friendly web application that
            empowers commuters by providing real-time bus tracking, accurate arrival time
            estimation, seat availability information, and fare computation. Through
            innovative GPS-based tracking and intelligent transportation tools, BUSahero
            aims to improve the daily commuting experience, reduce waiting time, and
            promote a safer, more efficient, and more convenient public transportation
            system between Olongapo City and Zambales.
          </p>
        </div>
        <BusIllustration className="w-full" />
      </div>

      <h3 className="mb-4 mt-8 border-b-2 border-brand pb-2 text-lg font-bold text-slate-800">
        Our Mission Goals
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <GoalCard icon={IconUsers} title="Serve Commuters">
          Provide passengers with accurate and timely transportation information for
          better travel planning.
        </GoalCard>
        <GoalCard icon={IconFlag} title="Improve Accessibility">
          Enable commuters to easily monitor bus locations and estimated arrival times in
          real time.
        </GoalCard>
        <GoalCard icon={IconClock} title="Reduce Waiting Time">
          Help passengers minimize unnecessary waiting through reliable arrival time
          estimation.
        </GoalCard>
        <GoalCard icon={IconBus} title="Enhance Public Transportation">
          Support more organized and efficient bus transportation services through modern
          technology.
        </GoalCard>
        <GoalCard icon={IconBulb} title="Promote Innovation">
          Develop practical technological solutions that contribute to smarter and more
          connected transportation systems.
        </GoalCard>
      </div>
    </div>
  );
}
