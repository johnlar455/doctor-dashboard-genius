
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center animate-fade-in space-y-4 max-w-md px-4">
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-4xl text-primary">404</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="pt-4">
          <Button asChild className="animate-pulse-soft">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
