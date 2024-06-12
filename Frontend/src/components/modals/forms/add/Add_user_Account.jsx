
import role from "../../../../assets/role.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useRef, useState } from "react";
import lock from "../../../../assets/password.svg";
import id_number from "../../../../assets/name.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

const passwordValidationRules = [
  (value) => ({
    message: "At least 8 characters",
    status: value.length >= 8,
  }),
  (value) => ({
    message: "At most 15 characters",
    status: value.length <= 15,
  }),
  (value) => ({
    message: "At least one lowercase letter",
    status: /[a-z]/.test(value),
  }),
  (value) => ({
    message: "At least one uppercase letter",
    status: /[A-Z]/.test(value),
  }),
  (value) => ({ message: "At least one digit", status: /\d/.test(value) }),
  (value) => ({
    message: "At least one special character",
    status: /[@$!%*?&]/.test(value),
  }),
];

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

const formSchema = z
  .object({
    idNumber: z.string().refine((value) => /^0300\d{6}$/.test(value), {
      message:
        "ID Number must be 10 digits with no space, special character, or letter and start with 0300.",
    }),
    employeeName: z.string().refine(
      (value) => {
        const nameParts = value.split(" ");
        return (
          nameParts.length > 1 &&
          nameParts.every((part) => part.length >= 2 && part.length <= 25)
        );
      },
      {
        message:
          "Invalid employee name. Please provide both first name and last name.",
      }
    ),
    role: z
      .string()
      .refine((value) => ["Shift Manager", "Admin"].includes(value), {
        message: 'Role must be either "shift manager" or "admin".',
      })
      .refine((value) => value.trim().length > 0, {
        message: "Role is required.",
      }),
    password: z.string().refine(
      (value) => {
        return passwordValidationRules.every((rule) => rule(value).status);
      },
      {
        message:
          "Password must be 8 to 15 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).",
      }
    ),
    confirmPassword: z.string().min(2).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

import axios from "axios";
// import useAuthStore from "@/page/authentication/useQueryUser";
import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import useQueryUser from "@/page/authentication/useQueryUser";

export default function Add_user_Account(props) {
  const forms = useRef();
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);
  const { userRefetch } = useQueryUser();
  const acc = {
    idNumber: "",
    employeeName: "",
    role: "",
    password: "",
  };
  //Passowrd!1

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
      employeeName: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [fields, setField] = useState({
    idNumber: "",
    employeeName: "",
    role: "",
    password: "",
  });

  const roles = [
    { role_id: 1, role_name: "Admin" },
    { role_id: 2, role_name: "Shift Manager" },
  ];

  const [disable, setdisable] = useState(true);
  const [valid, setvalid] = useState(
    passwordValidationRules.map((rule) => rule(fields.password))
  );
  useEffect(() => {
    setdisable(
      JSON.stringify(fields) === JSON.stringify(form.formState.defaultValues)
    );
    setvalid(passwordValidationRules.map((rule) => rule(fields.password)));
  }, [fields]);

  function onSubmit(values) {
    
    console.log(values);
    const addUser = async () => {
      const token = localStorage.getItem("token");
      try {
        console.log(token);
        const add = await axios.post(
          `http://localhost:3000/user/register`,
          {
            user,
            name: values.employeeName,
            id_number: values.idNumber,
            password: values.password,
            role_id: values.role === "Shift Manager" ? 2 : 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, // Include token type (Bearer)
            },
          }
        );
        setError(null);
        userRefetch();
        props.AddUser(false);
      } catch (error) {
          if (error.response.status === 403) {
            localStorage.clear();
            navigate(0);
            navigate("../login", { replace: true });
          }
                              
      }
    };

    addUser();
  }

  return (
    <Form {...form}>
      <form
        ref={forms}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 w-[1/2] h-[1/2]"
      >
        <div className="flex justify-between w-full font-normal ">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="font-normal">Role</FormLabel>

                <FormControl>
                  <div className="flex items-center">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.role_id}
                      value={field.value.role_id}
                      className="
                        border-none h-full ml-1 w-full outline-none ring-0 ring-opacity-0 focus-visible:ring-0 shadow-none  ring-none rounded-none"
                    >
                      <SelectTrigger>
                        <div className="flex">
                          <img src={role} className="pr-2 w-8" />

                          <SelectValue placeholder={field.value || "Role"} />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((rol, index) => {
                          return (
                            <SelectItem
                              key={index.toString()}
                              value={rol.role_name}
                            >
                              {rol.role_name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-4"></div>
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem
                className=" w-1/2"
                onChange={(e) => {
                  setField({ ...fields, idNumber: e.target.value });
                }}
              >
                <FormLabel className="font-normal"> ID Number</FormLabel>
                <div className="flex items-center  h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <img src={id_number} className="w-6" /> {/*icon*/}
                  <FormControl>
                    <Input
                    required
                      placeholder="e.g 0300829364"
                      {...field}
                      className="
                        border-none h-full ml-1 w-full outline-none ring-0 ring-opacity-0 focus-visible:ring-0 shadow-none  ring-none rounded-none"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="employeeName"
          render={({ field }) => (
            <FormItem
              className=" p-0 m-0"
              onChange={(e) => {
                setField({ ...fields, employeeName: e.target.value });
              }}
            >
              <FormLabel className="font-normal">Name</FormLabel>
              <div className="flex items-center  h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ">
                <img src={id_number} className="w-6" /> {/*icon*/}
                <FormControl>
                  <Input
                  required
                    placeholder="Enter Name"
                    {...field}
                    className="
                        border-none h-full ml-1 w-full outline-none ring-0 ring-opacity-0 focus-visible:ring-0 shadow-none  ring-none rounded-none"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem
              onChange={(e) => {
                setField({ ...fields, password: e.target.value });
              }}
            >
              <FormLabel className="font-normal">Password</FormLabel>
              <div className="flex items-center  h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ">
                <img src={lock} className="w-6" /> {/*icon*/}
                <FormControl>
                  <Input
                  required
                    placeholder="Enter a Password"
                    {...field}
                    type="password"
                    className="
                        border-none h-full ml-1 w-full outline-none ring-0 ring-opacity-0 focus-visible:ring-0 shadow-none  ring-none rounded-none"
                  />
                </FormControl>
              </div>
              <div className="text-xs">
                {valid.map((val, index) => {
                  return (
                    <div
                      key={index.toString()}
                      className={`${
                        val.status ? " hidden " : " text-red-500 flex"
                      }  `}
                    >
                      {val.message}
                    </div>
                  );
                })}
              </div>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">Confirm Password</FormLabel>
              <div className="flex items-center  h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ">
                <img src={lock} className="w-6" /> {/*icon*/}
                <FormControl>
                  <Input
                  required
                    placeholder="Confirm Password"
                    {...field}
                    type="password"
                    className="
                        border-none h-full ml-1 w-full outline-none ring-0 ring-opacity-0 focus-visible:ring-0 shadow-none  ring-none rounded-none"
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <div>
          {error !== null && (
            <div className="text-red-500 text-sm font-normal">{error}</div>
          )}
        </div>
        <Button type="submit" className="w-full py-4 text-xs bg-green-500">
          Add
        </Button>
      </form>
    </Form>
  );
}
