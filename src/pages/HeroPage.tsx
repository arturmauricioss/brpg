import { useNavigate } from 'react-router-dom';
import Page from '@components/shell/Page/Page';
import Title from '@components/ui/basic/Title/Title';
import RowHeader from '@components/ui/common/RowHeader/RowHeader';
import RowButton from '@components/ui/common/RowButton/RowButton';
import RowSpan from '@components/ui/common/RowSpan/RowSpan';
import { usePersonagens } from '@context/PersonagensContext';
import { ChessKnight, Skull } from '@components/ui/icons';

export default function HeroPage() {
  const navigate = useNavigate();
  const { personagens } = usePersonagens();

  return (
    <Page>
      <Title size="xl" className="">
        Salão dos Heróis
      </Title>
      <RowHeader icon={ChessKnight} active>
        Meus Heróis
      </RowHeader>
      {personagens.map((p) => (
        <RowSpan
          key={p.id}
          main={p.nome}
          rightSpans={[
            {
              content: p.raca?.label || p.raca?.key || '',
              className: 'hero-race',
            },
            {
              content:
                p.genero === 'masculino'
                  ? 'M'
                  : p.genero === 'feminino'
                    ? 'F'
                    : 'U',
            },
          ]}
        />
      ))}
      <RowButton
        buttons={[
          {
            label: 'Novo Personagem',
            onClick: () => navigate('/heroes/new'),
            variant: 'primary',
          },
        ]}
      />
      <RowHeader icon={Skull} variant="secondary">
        Memorial dos Caídos
      </RowHeader>
    </Page>
  );
}
