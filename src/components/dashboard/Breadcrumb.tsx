import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({
  links,
  brandColor = "text-primary",
}: {
  links: Array<{
    label: string;
    isActive?: boolean;
    href?: string;
    handleClick?: () => void;
  }>;
  brandColor?: string;
}) {
  return (
    <nav className="flex " aria-label="Breadcrumb">
      <ol className="flex items-center gap-0">
        {/* <li className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <button className="flex cursor-pointer items-center gap-1 font-medium text-gray-500 transition-colors duration-200 hover:text-gray-700">
              <span className="whitespace-nowrap hover:underline">Home</span>
            </button>
          </Link>
        </li> */}
        {links.map((link, index) => (
          <li key={index} className="flex  items-center">
            <Link onClick={link.handleClick} to={link.href || "#"}>
              <button
                className={`flex cursor-pointer items-center gap-1  transition-colors duration-200 ${
                  link.isActive
                    ? ` ${brandColor}`
                    : "font-medium text-gray-500 hover:text-gray-700"
                }`}
                disabled={link.isActive}
                aria-current={link.isActive ? "page" : undefined}
              >
                <span className="whitespace-nowrap hover:underline">
                  {(link.label || "").length > 30
                    ? `${(link.label || "").slice(0, 30)}...`
                    : link.label || ""}
                </span>
              </button>
            </Link>
            {index < links.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
