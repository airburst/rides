export const makeClickableUrl = (text: string) => {
  const exp =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  const text1 = text.replace(
    exp,
    "<a class=\"underline text-primary\" href='$1'>link</a>",
  );
  const exp2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;

  return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
};
