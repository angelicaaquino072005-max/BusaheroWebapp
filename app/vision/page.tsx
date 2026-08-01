import BusIllustration from "@/components/BusIllustration";
import GoalCard from "@/components/GoalCard";
import {
  IconEye,
  IconGlobe,
  IconUsers,
  IconBulb,
  IconCheckShield,
  IconHandshake,
} from "@/components/Icons";

export default function VisionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h2 className="mb-4 border-b-2 border-brand pb-2 text-xl font-bold text-slate-800">
        Vision
      </h2>

      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2 md:items-center">
        <div>
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-brand">
            <IconEye size={22} />
          </span>
          <h3 className="mb-2 text-base font-semibold text-brand">Our Vision</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Our vision is to become a trusted and innovative transportation solution that
            transforms the commuting experience through smart technology. BUSahero
            envisions a future where every commuter has access to accurate, real-time
            transportation information, enabling safer, faster, and more convenient
            travel while supporting the modernization of public transportation systems in
            the Philippines.
          </p>
        </div>
        <BusIllustration className="w-full" />
      </div>

      <h3 className="mb-4 mt-8 border-b-2 border-brand pb-2 text-lg font-bold text-slate-800">
        Our Vision Goals
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <GoalCard icon={IconGlobe} title="Smarter Transportation">
          Promote the adoption of intelligent transportation technologies that improve the
          efficiency of public transit services.
        </GoalCard>
        <GoalCard icon={IconUsers} title="Better Commuting Experience">
          Create a transportation environment where commuters can travel with confidence
          using reliable real-time information.
        </GoalCard>
        <GoalCard icon={IconBulb} title="Continuous Innovation">
          Encourage the continuous development of digital solutions that address
          transportation challenges.
        </GoalCard>
        <GoalCard icon={IconCheckShield} title="Reliable Information">
          Deliver accurate and dependable tracking and arrival estimates that commuters
          can trust.
        </GoalCard>
        <GoalCard icon={IconHandshake} title="Community Impact">
          Support communities by making public transportation more accessible, efficient,
          and user-friendly.
        </GoalCard>
      </div>
    </div>
  );
}
