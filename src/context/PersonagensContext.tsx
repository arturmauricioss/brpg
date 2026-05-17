import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@lib/supabase';
import { useAuth } from '@hooks/useAuth';

interface Personagem {
  id: string;
  nome: string;
  raca: { key: string; label: string } | null;
  genero: string;
  created_at: string;
}

interface PersonagensContextType {
  personagens: Personagem[];
  loading: boolean;
  podeCriar: boolean;
  limite: number;
  refresh: () => Promise<void>;
  salvarPersonagem: (personagem: Omit<Personagem, 'id' | 'created_at'>) => Promise<void>;
  removerPersonagem: (id: string) => Promise<void>;
}

const MAX_PERSONAGENS = 10;
const PersonagensContext = createContext<PersonagensContextType | null>(null);

export function PersonagensProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonagens = useCallback(async () => {
    if (!user) {
      setPersonagens([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('personagens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching personagens:', error);
      setPersonagens([]);
    } else {
      setPersonagens(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPersonagens();
  }, [fetchPersonagens]);

  // Realtime - ouve mudanças na tabela
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('personagens-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personagens',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPersonagem = payload.new as Personagem;
            setPersonagens((prev) => {
              if (prev.some((p) => p.id === newPersonagem.id)) return prev;
              return [newPersonagem, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedPersonagem = payload.old as Personagem;
            setPersonagens((prev) => prev.filter((p) => p.id !== deletedPersonagem.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedPersonagem = payload.new as Personagem;
            setPersonagens((prev) =>
              prev.map((p) => (p.id === updatedPersonagem.id ? updatedPersonagem : p))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const salvarPersonagem = async (personagem: Omit<Personagem, 'id' | 'created_at'>) => {
    if (!user) return;

    if (personagens.length >= MAX_PERSONAGENS) {
      throw new Error(`Limite máximo de ${MAX_PERSONAGENS} personagens atingido`);
    }

    const { data, error } = await supabase
      .from('personagens')
      .insert({
        user_id: user.id,
        nome: personagem.nome,
        raca: personagem.raca,
        genero: personagem.genero,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving personagem:', error);
      throw error;
    }

    if (data) {
      setPersonagens((prev) => [data, ...prev]);
    }
  };

  const removerPersonagem = async (id: string) => {
    const { error } = await supabase.from('personagens').delete().eq('id', id);

    if (error) {
      console.error('Error removing personagem:', error);
      throw error;
    }

    setPersonagens((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PersonagensContext.Provider
      value={{
        personagens,
        loading,
        podeCriar: personagens.length < MAX_PERSONAGENS,
        limite: MAX_PERSONAGENS,
        refresh: fetchPersonagens,
        salvarPersonagem,
        removerPersonagem,
      }}
    >
      {children}
    </PersonagensContext.Provider>
  );
}

export function usePersonagens() {
  const context = useContext(PersonagensContext);
  if (!context) {
    throw new Error('usePersonagens must be used within PersonagensProvider');
  }
  return context;
}