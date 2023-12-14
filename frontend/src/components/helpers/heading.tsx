
interface Props {
  title: string;
  description: string;
}
const Heading = (props: Props) => {
  const { title, description } = props;
  return (
    <div>
      {title && <h2 className="text-3xl text-left font-bold tracking-tight">{title}</h2>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default Heading;
