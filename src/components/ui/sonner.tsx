
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:p-6 group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group bg-green-50 border-green-200 text-green-800",
          error: "group bg-red-50 border-red-200 text-red-800",
          warning: "group bg-amber-50 border-amber-200 text-amber-800",
          info: "group bg-blue-50 border-blue-200 text-blue-800",
          title: "text-base font-medium",
        },
        duration: 5000,
        closeButton: true,
      }}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from "sonner"
