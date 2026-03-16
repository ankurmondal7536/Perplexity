import { Link } from 'react-router-dom'
 
export default function RegisterSuccess() {
  
  
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-zinc-950 to-[#0f0f1e] px-4 py-10 text-zinc-100 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#31b8c6] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#31b8c6] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
 
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center relative z-10">
        <div className="w-full max-w-md rounded-2xl border border-[#31b8c6]/30 bg-gradient-to-br from-zinc-900/50 via-zinc-950/70 to-zinc-900/50 px-8 py-10 shadow-2xl shadow-[#31b8c6]/10 backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">✉️</div>
            
            <h1 className="text-3xl font-bold text-[#31b8c6] mb-3">
              Verify Your Email
            </h1>
            
            <p className="text-sm text-zinc-300 leading-relaxed">
              A verification link has been sent to your email address. Click the link to activate your account.
            </p>
          </div>
 
          {/* Steps */}
          <div className="space-y-4 mb-8 bg-zinc-900/50 p-6 rounded-xl border border-[#31b8c6]/20">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#31b8c6] text-zinc-950 font-semibold text-sm">
                  1
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-zinc-100 text-sm">Check your email</p>
                <p className="text-xs text-zinc-400">Look for our verification email</p>
              </div>
            </div>
 
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#31b8c6] text-zinc-950 font-semibold text-sm">
                  2
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-zinc-100 text-sm">Click the link</p>
                <p className="text-xs text-zinc-400">Activate your account</p>
              </div>
            </div>
 
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#31b8c6] text-zinc-950 font-semibold text-sm">
                  3
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-zinc-100 text-sm">Login to your account</p>
                <p className="text-xs text-zinc-400">Start using the platform</p>
              </div>
            </div>
          </div>
 
          {/* Info Box */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-8">
            <p className="text-sm text-yellow-200">
              💡 <span className="font-semibold">Didn't receive the email?</span> Check your spam or junk folder.
            </p>
          </div>
 
          {/* Link expires info */}
          <p className="text-center text-xs text-zinc-400 mb-8">
            Link expires in 24 hours
          </p>
 
          {/* Action Button */}
          <Link 
            to="/login"
            className="block w-full text-center bg-gradient-to-r from-[#31b8c6] to-[#45c7d4] text-zinc-950 font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-[#31b8c6]/30 transition mb-6"
          >
            Go to Login
          </Link>
 
          {/* Footer */}
          <p className="text-center text-sm text-zinc-300">
            Already verified?{' '}
            <Link to="/login" className="font-semibold text-[#31b8c6] hover:text-[#45c7d4] transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}