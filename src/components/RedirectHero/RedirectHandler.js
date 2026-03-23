
// delayTime provided in seconds
export default function RedirectHandler({ href, delayTime }) {
  return (
      <script>
        {setTimeout(() => location.href = href, delayTime * 1000)}
      </script>
  );
}