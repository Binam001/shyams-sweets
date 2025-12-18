import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { useUserStore } from "@/store/userStore";

const formSchema = z.object({
  email: z
    .string()
    .min(8, { message: "Vendor email must be at least 8 character." })
    .max(40, {
      message: "Vendor email must be less than 40 characters.",
    })
    .email(),

  password: z
    .string()
    .min(7, {
      message: "Password must be at least 7 character.",
    })
    .max(50, {
      message: "Password must be less than 22 characters.",
    }),
});

export const UserRole = {
  SUDOADMIN: "SUDOADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

const LoginPage = () => {
  const { saveInfo } = useUserStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoging, setILoging] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useNavigate();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setILoging(true);
      const res = await api.post("/auth/signin", values);
      if (
        res.data.role !== UserRole.SUDOADMIN &&
        res.data.role !== UserRole.ADMIN &&
        res.data.role !== UserRole.USER
      ) {
        toast.error("You are not authorized.");
        setILoging(false);
        return;
      }
      if (
        res.data.role === UserRole.SUDOADMIN ||
        res.data.role === UserRole.ADMIN ||
        res.data.role === UserRole.USER
      ) {
        setILoging(false);
        saveInfo({ user: res.data });
        toast.success("Hey Admin, Welcome back to the dashboard.", {
          // position: "bottom-right",
          // description: "You have successfully logged in.",
        });
        router("/dashboard");
        return;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg || "An error occurred during login";
      toast.error(error?.response?.data?.message || errorMessage, {
        // position: "bottom-right",
        // description: "Please check your credentials and try again.",
      });
      setILoging(false);
    }
  };
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <Card className="w-full border border-border rounded-sm">
            <CardHeader className="text-center pt-6">
              <div className="flex justify-center p-4">
                <img
                  src="/logo/logo.png"
                  alt="Company Logo"
                  width={800}
                  height={84}
                  className="w-52 h-auto"
                />
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Please log in to continue managing the{" "}
                <span className="font-medium text-primary">Admin Portal</span>
              </CardDescription>
            </CardHeader>

            {/* Form Fields */}
            <CardContent className="grid gap-4 px-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="mb-3">
                      Email <span className="text-yellow-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        {...field}
                        className="bg-white mt-1 h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>
                      Password <span className="text-yellow-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="********"
                          {...field}
                          className="pr-10 bg-white mt-1 h-8"
                        />

                        <div className="absolute -translate-y-1/2 top-1/2 right-3 flex items-center cursor-pointer text-muted-foreground">
                          {showPassword ? (
                            <EyeOff
                              size={18}
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <Eye
                              size={18}
                              onClick={() => setShowPassword(true)}
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm px-0 h-auto"
                  // onClick={() => setForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </Button>
              </div>

              <Button
                onCopy={(e) => e.preventDefault()}
                disabled={isLoging}
                type="submit"
                className="bg-[#D42327] rounded-xs!"
              >
                {isLoging && <Loader size={16} className="animate-spin mr-2" />}
                Login
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* <ForgotPasswordModal
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      /> */}
    </div>
  );
};

export default LoginPage;
