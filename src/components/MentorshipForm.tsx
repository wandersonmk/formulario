import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Brain, Users, Trophy, Clock, Star, DollarSign, CreditCard } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  whatsapp: string;
  interest: string;
  currentJob: string;
  workType: string;
  businessOwner: string;
  city: string;
  motivation: string;
  acceptFrequency: boolean;
  acceptTimeCommitment: boolean;
  acceptGroupParticipation: boolean;
}

const MentorshipForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    whatsapp: '',
    interest: '',
    currentJob: '',
    workType: '',
    businessOwner: '',
    city: '',
    motivation: '',
    acceptFrequency: false,
    acceptTimeCommitment: false,
    acceptGroupParticipation: false,
  });
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.whatsapp.trim() !== '' &&
    formData.interest.trim() !== '' &&
    formData.currentJob.trim() !== '' &&
    formData.workType.trim() !== '' &&
    formData.businessOwner.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.motivation.trim() !== '' &&
    formData.acceptFrequency &&
    formData.acceptTimeCommitment &&
    formData.acceptGroupParticipation;

  // Função para aplicar máscara de telefone brasileiro
  function maskPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
      .slice(0, 15);
  }

  // Buscar cidades do IBGE conforme o usuário digita
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.city.length < 2) {
        setCitySuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios`);
        const data = await res.json();
        const filtered = data
          .map((c: any) => c.nome)
          .filter((nome: string) => nome.toLowerCase().startsWith(formData.city.toLowerCase()))
          .slice(0, 8);
        setCitySuggestions(filtered);
      } catch {
        setCitySuggestions([]);
      }
    };
    fetchCities();
  }, [formData.city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação básica
    if (!isFormValid) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios e confirme os compromissos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetch('https://n8n-n8n-start.ym5qed.easypanel.host/webhook/mentoria', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          mentorship_application: {
            nome: formData.name,
            telefone_whatsapp: formData.whatsapp,
            interesse_mentoria: formData.interest,
            trabalho_atual: formData.currentJob,
            tipo_trabalho: formData.workType,
            dono_empresa: formData.businessOwner,
            cidade: formData.city,
            motivacao: formData.motivation,
            aceita_frequencia: formData.acceptFrequency,
            aceita_tempo_comprometimento: formData.acceptTimeCommitment,
            aceita_grupo: formData.acceptGroupParticipation
          }
        }),
      });

      toast({
        title: "Inscrição enviada!",
        description: "Sua candidatura para a mentoria foi enviada com sucesso. Entraremos em contato em breve!",
      });

      // Reset form
      setFormData({
        name: '',
        whatsapp: '',
        interest: '',
        currentJob: '',
        workType: '',
        businessOwner: '',
        city: '',
        motivation: '',
        acceptFrequency: false,
        acceptTimeCommitment: false,
        acceptGroupParticipation: false
      });

      // Redirecionar para página de parabéns
      navigate("/parabens");
    } catch (error) {
      console.error("Erro ao enviar webhook:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar a inscrição. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Mentoria RW MasterClass
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            O futuro é de quem domina a IA! Empresas buscam gestores de fluxo para automatizar processos e liderar com inteligência. Participe da mentoria gratuita nesta quinta-feira e descubra como conquistar oportunidades e se destacar no mercado. Garanta sua vaga!
          </p>
          <div className="mt-4">
            <Button
              onClick={() => document.getElementById('formulario-inscricao')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Preencher Formulário
            </Button>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Encontro Exclusivo</h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-2 z-0 rounded-3xl animate-spin-slow bg-[conic-gradient(from_0deg,rgba(99,102,241,0.3)_0%,rgba(168,85,247,0.3)_50%,rgba(99,102,241,0.3)_100%)] blur-md"></span>
              <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 z-10">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-blue-800 mb-2">Encontro Exclusivo</CardTitle>
                  <CardDescription className="text-blue-700 font-medium">Encontro dia 12/06/2025 (quinta-feira) - Mentoria gratuita</CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-2">
                  <p className="text-lg text-blue-800 mb-3">Venha participar do nosso encontro exclusivo e descubra como transformar sua carreira!</p>
                  <p className="text-sm text-blue-600">Não perca esta oportunidade única!</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 text-center">
              <Button
                onClick={() => document.getElementById('formulario-inscricao')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Preencher Formulário
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-blue-800">Expertise Avançada</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-blue-700 text-sm leading-relaxed">Domine prospecção, reuniões, análise de necessidades e precificação premium</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-purple-800">Network Exclusivo</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-purple-700 text-sm leading-relaxed">Grupo seleto de 6-10 mentorados para networking e troca de experiências</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-indigo-800">Bônus Exclusivos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-indigo-700 text-sm leading-relaxed">Se for aluno, ganha mais um ano grátis; se não for, ganha 1 ano de acesso ao curso</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <Card id="formulario-inscricao" className="border-0 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
            <CardTitle className="text-2xl text-center font-bold">Formulário de Inscrição</CardTitle>
            <CardDescription className="text-blue-100 text-center text-base">
              Preencha suas informações para se candidatar à mentoria
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dados Pessoais */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Dados Pessoais</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', maskPhone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">Cidade onde mora</Label>
                    <div className="relative">
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => {
                          handleInputChange('city', e.target.value);
                          setShowCitySuggestions(true);
                        }}
                        placeholder="Sua cidade"
                        className="h-12"
                        autoComplete="off"
                      />
                      {showCitySuggestions && citySuggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                          {citySuggestions.map((city) => (
                            <li
                              key={city}
                              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                              onClick={() => {
                                handleInputChange('city', city);
                                setShowCitySuggestions(false);
                              }}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentJob" className="text-sm font-medium">Trabalho Atual</Label>
                    <Input
                      id="currentJob"
                      value={formData.currentJob}
                      onChange={(e) => handleInputChange('currentJob', e.target.value)}
                      placeholder="Descreva sua ocupação atual"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Perfil Profissional */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Perfil Profissional</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Como pretende trabalhar?</Label>
                    <RadioGroup
                      value={formData.workType}
                      onValueChange={(value) => handleInputChange('workType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="freelancer" id="freelancer" />
                        <Label htmlFor="freelancer">Freelancer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="agencia" id="agencia" />
                        <Label htmlFor="agencia">Abrir agência</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="aprender_sem_fins_lucrativos" id="aprender_sem_fins_lucrativos" />
                        <Label htmlFor="aprender_sem_fins_lucrativos">Só quero aprender sem fins lucrativos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="desenvolver_para_empresa" id="desenvolver_para_empresa" />
                        <Label htmlFor="desenvolver_para_empresa">Quero desenvolver pra minha empresa</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Situação empresarial</Label>
                    <RadioGroup
                      value={formData.businessOwner}
                      onValueChange={(value) => handleInputChange('businessOwner', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dono_empresa" id="dono_empresa" />
                        <Label htmlFor="dono_empresa">Já sou dono de empresa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="aprender_profissao" id="aprender_profissao" />
                        <Label htmlFor="aprender_profissao">Quero aprender a profissão para renda principal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Interesse e Motivação */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Interesse e Motivação</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nível de interesse em participar da mentoria</Label>
                    <Select value={formData.interest} onValueChange={(value) => handleInputChange('interest', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione seu nível de interesse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="muito_alto">Muito Alto - Extremamente interessado</SelectItem>
                        <SelectItem value="alto">Alto - Muito interessado</SelectItem>
                        <SelectItem value="medio">Médio - Interessado</SelectItem>
                        <SelectItem value="baixo">Baixo - Pouco interessado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivation" className="text-sm font-medium">
                      Por que gostaria de participar desta mentoria durante 3 meses?
                    </Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      placeholder="Descreva suas motivações, objetivos e expectativas..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Compromissos */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Compromissos da Mentoria</h3>
                </div>

                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="frequency"
                      checked={formData.acceptFrequency}
                      onCheckedChange={(checked) => handleInputChange('acceptFrequency', checked)}
                    />
                    <Label htmlFor="frequency" className="text-sm leading-relaxed">
                      <strong>Aceito participar da mentoria 2 vezes por semana durante 3 meses</strong>
                      <br />
                      <span className="text-muted-foreground">Total de 24 sessões ao longo do programa</span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="time"
                      checked={formData.acceptTimeCommitment}
                      onCheckedChange={(checked) => handleInputChange('acceptTimeCommitment', checked)}
                    />
                    <Label htmlFor="time" className="text-sm leading-relaxed">
                      <strong>Aceito disponibilizar 1 hora do meu tempo para cada encontro</strong>
                      <br />
                      <span className="text-muted-foreground">Compromisso de participação ativa e pontualidade</span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="group"
                      checked={formData.acceptGroupParticipation}
                      onCheckedChange={(checked) => handleInputChange('acceptGroupParticipation', checked)}
                    />
                    <Label htmlFor="group" className="text-sm leading-relaxed">
                      <strong>Aceito participar do grupo de no máximo 6 a 10 mentorados</strong>
                      <br />
                      <span className="text-muted-foreground">Ambiente colaborativo para networking, ideias de projetos e dúvidas</span>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {isLoading ? "Enviando..." : "Enviar Inscrição para Mentoria"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorshipForm;
