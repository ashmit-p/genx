"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`flex flex-col gap-2 justify-center min-w-[100px] rounded-lg bg-white dark:bg-gray-500 border dark:border-slate-800`}
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={`w-full px-3 py-2 justify-center rounded-md cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 
            `}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={`w-full justify-center px-3 py-2 rounded-md cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 
            
          `
        }
        >
          Dark
        </DropdownMenuItem>
        {/* <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={`w-full px-3 py-2 rounded-md cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 ${
            theme === 'system' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : ''
          }`}
        >
          System
        </DropdownMenuItem> */}
      </DropdownMenuContent>  
    </DropdownMenu>
  )
}
