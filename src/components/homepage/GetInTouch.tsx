export default function GetInTouch() {
  return (
    <section className="px-4 text-center">
      <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
      <p className="text-gray-600 mb-4">
        I'd love to hear from you! Whether it's feedback, collaboration, or just a hello.
      </p>
      <a
        href="mailto:your@email.com"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Send a Message
      </a>
    </section>
  );
}
