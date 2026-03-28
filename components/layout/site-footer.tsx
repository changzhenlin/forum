export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-sm text-muted-foreground md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-sm font-semibold text-white">
              F
            </div>
            <span className="text-xl font-semibold text-slate-900">Forum</span>
          </div>
          <p>A modern community platform for meaningful discussions.</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-slate-900">Product</h4>
          <ul className="space-y-2">
            <li>Features</li>
            <li>Pricing</li>
            <li>Roadmap</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-slate-900">Community</h4>
          <ul className="space-y-2">
            <li>Guidelines</li>
            <li>Events</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-slate-900">Company</h4>
          <ul className="space-y-2">
            <li>About</li>
            <li>Contact</li>
            <li>Admin</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2026 Forum. All rights reserved.
      </div>
    </footer>
  );
}
