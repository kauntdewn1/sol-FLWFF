'use client';

import { motion } from 'framer-motion';
import { Lock, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StakingStatusProps {
  status: 'available' | 'closed' | 'redeeming' | 'completed';
  amount?: string;
  timeRemaining?: string;
}

const StakingStatus = ({ status, amount, timeRemaining }: StakingStatusProps) => {
  const statusConfig = {
    available: {
      label: 'Disponível',
      icon: <ArrowUpRight className="h-5 w-5 text-green-500" />,
      tooltip: 'Aberto para novos aportes. Inicie seu staking agora.',
      className: 'border-green-500/20 bg-green-500/5 hover:border-green-500/40 hover:bg-green-500/10',
      opacity: 'opacity-100',
      interactive: true
    },
    closed: {
      label: 'Encerrado',
      icon: <Lock className="h-5 w-5 text-gray-400" />,
      tooltip: 'Período de staking finalizado. Aguardando novos ciclos.',
      className: 'border-gray-500/20 bg-gray-500/5',
      opacity: 'opacity-40 grayscale',
      interactive: false
    },
    redeeming: {
      label: 'Em Resgate',
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      tooltip: `Tokens aguardando liberação. Tempo estimado: ${timeRemaining || '5 dias'}.`,
      className: 'border-yellow-500/20 bg-yellow-500/5',
      opacity: 'opacity-50',
      interactive: false
    },
    completed: {
      label: 'Finalizado',
      icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
      tooltip: 'Período de staking concluído. Retornos disponíveis para retirada.',
      className: 'border-blue-500/20 bg-blue-500/5',
      opacity: 'opacity-40',
      interactive: true
    }
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={config.interactive ? { scale: 1.02 } : {}}
            className={cn(
              "relative p-6 rounded-lg border-2 transition-all duration-300",
              config.className,
              config.opacity,
              config.interactive ? "cursor-pointer" : "cursor-default"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {config.label}
              </span>
              {config.icon}
            </div>
            {amount && (
              <div className="text-2xl font-bold text-foreground mb-2">
                {amount} FLWFF
              </div>
            )}
            {timeRemaining && (
              <div className="text-sm text-muted-foreground">
                {timeRemaining}
              </div>
            )}
            {status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full border-green-500/20 text-green-500 hover:bg-green-500/10"
              >
                Retirar
              </Button>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function StakingSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Trave seus FLWFF e amplie seu impacto no ecossistema
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Quanto mais tempo você contribui, maior sua participação nos retornos e decisões
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          <StakingStatus
            status="available"
            amount="1,000"
          />
          <StakingStatus
            status="closed"
            amount="2,500"
          />
          <StakingStatus
            status="redeeming"
            amount="5,000"
            timeRemaining="5d 12h"
          />
          <StakingStatus
            status="completed"
            amount="10,000"
          />
        </motion.div>
      </div>
    </section>
  );
}
