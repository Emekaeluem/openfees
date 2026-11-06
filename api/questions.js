
/*
  OPENFEES ACADEMY
  Optional historical-question API

  Requires Vercel environment variables:

  ALOC_API_KEY
  ALOC_RIGHTS_CONFIRMED=true

  Never expose your secret key in frontend code.

  Historical examination years are
  provider-supplied metadata.
*/

const allowedExams = new Set([
  "jamb",
  "waec",
  "neco"
]);

const allowedSubjects = new Set([
  "mathematics",
  "english language",
  "biology",
  "chemistry",
  "physics",
  "economics",
  "government"
]);

module.exports = async function handler(req, res) {

  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Only GET requests are supported."
    });
  }

  if (
    !process.env.ALOC_API_KEY ||
    process.env.ALOC_RIGHTS_CONFIRMED !== "true"
  ) {
    return res.status(503).json({
      error:
        "Historical questions are not enabled. Configure licensed API access first."
    });
  }

  const exam = String(
    req.query.exam || ""
  ).toLowerCase();

  const subject = String(
    req.query.subject || ""
  ).toLowerCase();

  const count = Number(req.query.count);

  if (
    !allowedExams.has(exam) ||
    !allowedSubjects.has(subject) ||
    ![10, 20, 40, 60].includes(count)
  ) {
    return res.status(400).json({
      error: "Invalid examination, subject or question count."
    });
  }

  const questions = [];
  const ids = new Set();

  let cursor = null;

  try {

    for (
      let page = 0;
      page < 12 && questions.length < count;
      page++
    ) {

      const url = new URL(
        "https://dev.aloc.com.ng/api/v1/questions"
      );

      url.searchParams.set("examType", exam);
      url.searchParams.set("subject", subject);
      url.searchParams.set("limit", "15");
      url.searchParams.set("contentSource", "historical");

      if (cursor) {
        url.searchParams.set("cursor", cursor);
      }

      const response = await fetch(
        url.toString(),
        {
          headers: {
            "X-API-Key": process.env.ALOC_API_KEY,
            "Accept": "application/json"
          },
          signal: AbortSignal.timeout(9000)
        }
      );

      if (!response.ok) {
        return res.status(502).json({
          error:
            "The historical-question provider is currently unavailable."
        });
      }

      const body = await response.json();

      const results = Array.isArray(body.data)
        ? body.data
        : [];

      for (const item of results) {

        if (!item.id || ids.has(item.id)) {
          continue;
        }

        const options = item.options;

        if (
          !options ||
          !["a", "b", "c", "d"].every(
            key =>
              typeof options[key] === "string" &&
              options[key].trim()
          )
        ) {
          continue;
        }

        const answer = [
          "a",
          "b",
          "c",
          "d"
        ].indexOf(
          String(item.correctAnswer || "").toLowerCase()
        );

        if (answer < 0 || !item.text) {
          continue;
        }

        ids.add(item.id);

        const reviewed =
          item.provenance?.contentSource === "historical" &&
          item.provenance?.reviewStatus === "approved";

        const year = Number(item.year);

        const validYear =
          reviewed &&
          Number.isInteger(year) &&
          year >= 1970 &&
          year <= new Date().getFullYear();

        questions.push({
          id: String(item.id),
          subject,
          topic: item.topic || "General Practice",
          question: String(item.text),

          options: [
            options.a,
            options.b,
            options.c,
            options.d
          ],

          correct: answer,

          explanation: String(
            item.explanation || ""
          ),

          year: validYear ? year : null,

          reviewed: Boolean(reviewed),

          origin: "historical"
        });

        if (questions.length === count) {
          break;
        }
      }

      if (
        !body.pagination?.hasMore ||
        !body.pagination?.nextCursor
      ) {
        break;
      }

      cursor = body.pagination.nextCursor;
    }

    if (questions.length < count) {
      return res.status(422).json({
        error:
          `Only ${questions.length} usable questions are available for this selection. Choose fewer questions or use original practice.`
      });
    }

    return res.status(200).json({
      questions
    });

  } catch (error) {

    console.error(
      "Historical-question provider request failed."
    );

    return res.status(502).json({
      error:
        "Unable to retrieve historical questions. Please try original practice."
    });

  }
};
