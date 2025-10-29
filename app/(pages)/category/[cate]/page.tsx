import CateComp from "@/app/components/CateComp";

const page = ({ params }: any) => {
  return <CateComp cat={params} />;
};
export const generateMetadata = ({ params }: any) => {
  return {
    title: `${params.cate} category`,
    description: `Explore the latest in Category ${params.cate}. Find your style today!`,
  };
};

export default page;
