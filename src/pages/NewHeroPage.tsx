import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@components/shell/Page/Page';
import Title from '@components/ui/basic/Title/Title';
import RowHeader from '@components/ui/common/RowHeader/RowHeader';
import RowSelect from '@components/ui/common/RowSelect/RowSelect';
import RowInputButton from '@components/ui/common/RowInputButton/RowInputButton';
import RowButton from '@components/ui/common/RowButton';
import RaceSelect from '@features/raceSelection/RaceSelect';
import { useNewHero } from '@features/newHero/hooks/useNewHero';
import { usePersonagens } from '@context/PersonagensContext';
import { Spawn } from '@components/ui/icons';
import '@features/raceSelection/RaceSelect.css';

export default function NewHeroPage() {
  const navigate = useNavigate();
  const { salvarPersonagem } = usePersonagens();
  const [saving, setSaving] = useState(false);
  const {
    nome,
    setNome,
    raca,
    setRaca,
    genero,
    setGenero,
    gerarNome,
    gerarNomeRaca,
    isBotaoRacaDisabled,
  } = useNewHero();

  const handleSalvar = async () => {
    if (saving) return;
    
    if (!nome || !raca || !genero) {
      alert('Preencha nome, raça e gênero!');
      return;
    }

    setSaving(true);
    
    try {
      await salvarPersonagem({
        nome,
        raca,
        genero,
      });
      navigate('/heroes');
    } catch (error) {
      alert('Erro ao salvar personagem');
      setSaving(false);
    }
  };

  return (
    <Page>
      <Title size="xl" className="">
        Novo Personagem
      </Title>
      <RowHeader icon={Spawn} active>
        Origem
      </RowHeader>
      <RaceSelect value={raca} onChange={setRaca} />
      <RowSelect
        selects={[
          {
            value: genero,
            onChange: setGenero,
            options: [
              { value: 'masculino', label: 'Masculino' },
              { value: 'feminino', label: 'Feminino' },
            ],
          },
        ]}
      />
      <RowInputButton
        inputProps={{
          placeholder: 'Nome do personagem',
          value: nome,
          onChange: (e) => setNome(e.target.value),
        }}
        buttons={[
          {
            label: 'Raça',
            onClick: gerarNomeRaca,
            disabled: isBotaoRacaDisabled,
          },
          { label: '?', onClick: gerarNome },
        ]}
      />
      <RowButton
        buttons={[
          {
            label: 'Cancelar',
            onClick: () => navigate('/heroes'),
            variant: 'secondary',
            disabled: saving,
          },
          { 
            label: saving ? 'Salvando...' : 'Salvar', 
            onClick: handleSalvar, 
            variant: 'primary',
            disabled: saving 
          },
        ]}
      />
    </Page>
  );
}
  