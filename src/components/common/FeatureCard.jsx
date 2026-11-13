function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <div className="text-5xl">{icon}</div>

      <h3 className="mt-6 text-2xl font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-4 text-gray-600 leading-7">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;