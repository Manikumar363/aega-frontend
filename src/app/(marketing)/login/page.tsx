import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050b1f]">
      {/* Background Images */}
      <Image
        src="/common/bg-left-shape.png"
        alt="1"
        fill
        className="object-cover"
        priority
      />

      <Image
        src="/common/bg-right-shape.png"
        alt="3"
        width={700}
        height={500}
        className="absolute right-0 top-0"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Title */}
        <h1 className="mb-10 text-3xl font-semibold tracking-wide text-white">
          SIGN IN
        </h1>

        {/* Main Card */}
        <div className="flex w-full max-w-[1300px] gap-10">
          {/* Left Image */}
          <div className="hidden md:flex w-[360px] justify-center">
            <div className="relative h-[460px] w-[320px] rounded-md">
              <Image
                src="/common/bg-right.png"
                alt="Presentation4"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Form */}
          <div className="flex-1 max-w-[620px]">
            {/* Toggle */}
            <div className="flex mb-6">
              <button className="flex-1 bg-[#f7941d] py-2 text-sm font-medium text-white">
                AGENT
              </button>
              <button className="flex-1 border border-white/30 py-2 text-sm font-medium text-white">
                UNIVERSITY
              </button>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-1 block text-sm text-white/70">
                Email*
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="w-full border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d]"
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="mb-1 block text-sm text-white/70">
                Password*
              </label>
              <input
                type="password"
                placeholder="********"
                className="w-full border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white/40 outline-none focus:border-[#f7941d]"
              />
            </div>

            <div className="mb-4 text-right">
              <span className="cursor-pointer text-sm text-white/60 hover:text-[#f7941d]">
                Forget Password
              </span>
            </div>

            {/* Captcha (Static) */}
            <div className="mb-6 flex items-center justify-between bg-white px-4 py-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" />
                I’m not a robot
              </label>
              <span className="text-xs text-gray-500">reCAPTCHA</span>
            </div>

            {/* Sign In */}
            <button className="w-[180px] bg-[#f7941d] py-2 text-sm font-medium text-white hover:opacity-90">
              SIGN IN
            </button>

            <p className="mt-4 text-sm text-white/60">
              Don’t have an account?{" "}
              <span className="cursor-pointer text-[#f7941d]">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
