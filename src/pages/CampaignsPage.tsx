import Page from '@components/shell/Page/Page';
import Title from '@components/ui/basic/Title/Title';
import { ChessKing, Swords } from '@/components/ui/icons';
import RowHeader from '@/components/ui/common/RowHeader/RowHeader';
import RowButton from '@/components/ui/common/RowButton';
import { useNavigate } from 'react-router-dom';

export default function CampaignsPage() {
  const navigate = useNavigate();
  return (
    <Page>
      <Title size="xl" className="">
        Campanhas
      </Title>
      <RowHeader icon={Swords} active>
        Aventurar-se
      </RowHeader>
      <RowButton
        buttons={[
          {
            label: 'Jogar Nova Campanha',
            onClick: () => navigate('/campaigns/join'),
            variant: 'primary',
          },
        ]}
        />
    
      <RowHeader icon={ChessKing} active>
        Mestrar
      </RowHeader>
      <RowButton
        buttons={[
          {
            label: 'Mestrar Nova Campanha',
            onClick: () => navigate('/campaigns/new'),
            variant: 'primary',
          },
        ]}
        />
    </Page>
  );
}
