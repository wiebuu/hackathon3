import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"student" | "teacher">("student");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // Store locally
      localStorage.setItem("userType", userType);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);

      toast({
        title: "Account Created",
        description: `Welcome, ${name}!`,
      });

      navigate("/dashboard");
    } catch (err: any) {
      // Use Firebase error codes
      toast({
        title: "Signup Failed",
        description: err.code || err.message || "Unable to create account",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-4xl mx-auto animate-slide-up">
        <Card className="card-glass shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-[Poppins-Bold] text-foreground mb-3">
              Create Your Account
            </CardTitle>
            <p className="text-muted-foreground text-lg font-[Poppins-Light]">
              Sign up as a Student or Teacher
            </p>
          </CardHeader>
          <CardContent className="p-8 font-[Poppins-Light]">
            <Tabs
              defaultValue="student"
              onValueChange={(val) => setUserType(val as "student" | "teacher")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50">
                <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Student
                </TabsTrigger>
                <TabsTrigger value="teacher" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Teacher
                </TabsTrigger>
              </TabsList>

              <TabsContent value={userType}>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-[Poppins-Medium]">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="input-modern" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-[Poppins-Medium]">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-modern" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base font-[Poppins-Medium]">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-modern" />
                  </div>
                  <Button type="submit" className={`w-full ${userType === "student" ? "btn-primary-modern" : "btn-secondary-modern"} text-lg py-4`}>
                    Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-[Poppins-Medium]">
                Already have an account? <span onClick={() => navigate("/")} className="text-primary cursor-pointer">Login</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
