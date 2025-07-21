import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Home, LogOut, CalendarPlus, PanelBottom, Settings, CalendarDays } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Sidebar(){
    return(
        <div className="flex w-full flex-col bg-muted/40">

            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-none bg-zinc-900 sm:flex flex-col">
                <nav className="flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider>
                        <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Avatar</span>
                        </Link>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-white">
                                    <Home className="h-5 w-5"/>
                                    <span className="sr-only">Início</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Início</TooltipContent>

                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-white">
                                <CalendarPlus className="h-5 w-5"/>
                                <span className="sr-only">Novo agendamento</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Novo agendamento</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-white">
                                <CalendarDays className="h-5 w-5"/>
                                <span className="sr-only">Meus agendamentos</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Meus agendamentos</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-white">
                                <Settings className="h-5 w-5"/>
                                <span className="sr-only">Configurações</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Configurações</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>

                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider>
                    <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                <LogOut className="h-5 w-5 text-red-500"/>
                                <span className="sr-only">Sair</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Sair</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>

            <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden"> {/* sm:hidden - esconde o item "display-none" a partir da altura minima da tela "640px", ideal para menu mobile */}
                                <PanelBottom className="w-5 h-5"/>
                                <span className="sr-only">Abrir / Fechar menu</span> {/* sr-only - função do tailwind, oculta o item do menu mas não oculta do leitor, acessibilidade */}
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="sm:max-w-xs">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link href="/"
                                className="flex h-10 w-10 rounded-full text-lg items-center justify-center text-primary-foreground md-text-base gap-2"
                                prefetch={false}>
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>                                <span className="sr-only">Logo</span>
                                </Link>

                                <Link 
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                prefetch={false}>
                                <Home className="h-5 w-5 transition-all"/>
                                Início
                                </Link>
                                
                                <Link 
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                prefetch={false}>
                                <CalendarPlus className="h-5 w-5 transition-all"/>
                                Novo agendamento
                                </Link>

                                <Link 
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                prefetch={false}>
                                <CalendarDays className="h-5 w-5 transition-all"/>
                                Meus agendamentos
                                </Link>

                                <Link 
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                prefetch={false}>
                                <Settings className="h-5 w-5 transition-all"/>
                                Configurações
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <h2>Menu</h2>
                </header>
            </div>
        </div>
    )
}