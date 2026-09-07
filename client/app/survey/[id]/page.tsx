import SurveyID from '@/lib/ui/survey/page';


export default async function Page({ params }: { params: Promise<{id: string}>}) {

  const { id } = await params
  return (
    <SurveyID slug={id}/>
  )
}
