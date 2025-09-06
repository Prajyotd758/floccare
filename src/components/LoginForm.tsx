"use client";
import { useState, useContext } from "react";
import { signIn, useSession } from "next-auth/react";

export const LoginForm = ({ scrollin }: { scrollin: String }) => {
  const { data: session } = useSession();
  type userdata = {
    useremail: String;
    password: String;
  };

  const [LoginData, SetLoginData] = useState<userdata>({
    useremail: "",
    password: "",
  });

  const handleState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetLoginData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const LoginUser = async () => {
    if (LoginData.useremail === "" || LoginData.password === "") {
      alert("Fields can not be empty.");
    } else {
      try {
        const { useremail, password } = LoginData;
        const result = await signIn("credentials", {
          useremail: useremail,
          password,
          redirect: false,
        });

        if (result?.error) {
          alert(`Invalid crdentials!`);
        }
      } catch (error) {
        alert(`Error has occured, please try later!`);
      }
    }
  };

  return (
    <div className={`forms ${scrollin} scroll-in-gsap`}>
      <input
        type="text"
        placeholder="Email"
        onChange={handleState}
        name="useremail"
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={handleState}
        name="password"
        required
      />
      <button onClick={LoginUser}>Sign in</button>
      or
      <button
        className="sign-in-google"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          color: "black",
          border: "1px solid rgba(128, 128, 128, 0.5)",
          height: "9%",
        }}
        onClick={() => signIn("google")}
      >
        <img
          style={{
            height: "30px",
            width: "auto",
          }}
          src="/google.png"
          alt="Sign in with Google"
        />
        Directly sign in with Google
      </button>
    </div>
  );
};
